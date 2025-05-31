'use client';
import { Check, Moon, Sun, Monitor } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/app/components/ui/card';
import {
  TabsContent,
} from '@/app/components/ui/tabs';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/app/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { ColorSubtoneSelector } from './ColorSubtoneSelector';

const SetApearance = () => {
  const { theme, setTheme } = useTheme();
  
  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean, bright interface',
      icon: Sun
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easier on the eyes',
      icon: Moon
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor
    }
  ];

  return (
    <TabsContent value="appearance" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Theme Mode</h4>
            <RadioGroup
              value={theme || 'system'}
              onValueChange={setTheme}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                
                return (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`theme-${option.value}`}
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={`theme-${option.value}`}
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all duration-200 h-32"
                    >
                      <Icon className="h-6 w-6 mb-3" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium leading-none">{option.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          <ColorSubtoneSelector />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SetApearance;