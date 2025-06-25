import { NextRequest, NextResponse } from 'next/server';
import { supabaseNewsServiceServer } from '@/app/lib/services/supabase-news-service-server';

export const dynamic = 'force-dynamic';
export const revalidate = 43200; // 12 hours

interface CountryCount {
  country: string;
  count: number;
  lastUpdated: string;
}

// ✅ Add server-side cache to prevent duplicate DB queries
const serverCache = new Map<string, { data: Record<string, CountryCount>; timestamp: number }>();
const SERVER_CACHE_DURATION = 10 * 60 * 1000; 

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const countries = searchParams.get('countries')?.split(',') || ['worldwide'];
    const cacheKey = countries.sort().join(',');
    
    // ✅ Check server cache first
    const cached = serverCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < SERVER_CACHE_DURATION) {
      console.log('📋 Using server cached counts for:', countries);
      return NextResponse.json({
        counts: cached.data,
        totalCountries: countries.length,
        __meta: {
          fetchTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          cached: true,
          cacheAge: Date.now() - cached.timestamp,
          cacheInfo: {
            revalidateIn: revalidate,
            nextRefresh: new Date(Date.now() + revalidate * 1000).toISOString()
          }
        }
      }, {
        headers: {
          'Cache-Control': `s-maxage=${revalidate}, stale-while-revalidate=21600`,
          'X-Cache': 'HIT'
        }
      });
    }
    
    console.log('📊 Fetching news counts for countries:', countries);
    
    const countPromises = countries.map(async (countryCode): Promise<CountryCount> => {
      try {
        const filters = countryCode === 'worldwide' 
          ? {} 
          : { country: countryCode };
          
        const count = await supabaseNewsServiceServer.getNewsCount(filters);
        
        return {
          country: countryCode,
          count,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error(`❌ Failed to get count for ${countryCode}:`, error);
        return {
          country: countryCode,
          count: 0,
          lastUpdated: new Date().toISOString()
        };
      }
    });

    const counts = await Promise.all(countPromises);
    
    const countsMap = counts.reduce((acc, item) => {
      acc[item.country] = item;
      return acc;
    }, {} as Record<string, CountryCount>);

    serverCache.set(cacheKey, {
      data: countsMap,
      timestamp: Date.now()
    });

    const totalCount = Object.values(countsMap).reduce((sum, item) => sum + item.count, 0);
    console.log(`✅ News counts fetched: ${countries.length} countries, ${totalCount} total articles`);

    return NextResponse.json({
      counts: countsMap,
      totalCountries: countries.length,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        cached: false,
        cacheInfo: {
          revalidateIn: revalidate,
          nextRefresh: new Date(Date.now() + revalidate * 1000).toISOString()
        }
      }
    }, {
      headers: {
        'Cache-Control': `s-maxage=${revalidate}, stale-while-revalidate=21600`,
        'X-Cache': 'MISS'
      }
    });

  } catch (error) {
    console.error('💥 News counts API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news counts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}