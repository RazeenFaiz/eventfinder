'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Clock, Activity } from 'lucide-react';

interface ScrapingStatus {
  totalEvents: number;
  recentEvents: number;
  lastScrapeTime: string | null;
  isRunning: boolean;
}

export function ScrapingStatus() {
  const [status, setStatus] = useState<ScrapingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/scraping/status');
      const result = await response.json();
      if (result.success) {
        setStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch scraping status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runScraping = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/scraping/run', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        // Refresh status after a delay
        setTimeout(fetchStatus, 2000);
      }
    } catch (error) {
      console.error('Failed to run scraping:', error);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading scraping status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Unable to load scraping status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          Scraping Status
          {status.isRunning && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Running
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">{status.totalEvents}</p>
            <p className="text-sm text-muted-foreground">Total Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{status.recentEvents}</p>
            <p className="text-sm text-muted-foreground">Added Today</p>
          </div>
        </div>
        
        {status.lastScrapeTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Last scraped: {new Date(status.lastScrapeTime).toLocaleString()}
            </span>
          </div>
        )}
        
        <Button 
          onClick={runScraping} 
          disabled={running || status.isRunning}
          className="w-full"
          variant="outline"
        >
          {running || status.isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Scraping Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}