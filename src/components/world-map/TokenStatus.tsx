import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCcw, ShieldCheck, Globe } from 'lucide-react';

interface TokenStatusProps {
  token: string;
  onRefresh: () => void;
  onReset?: () => void;
}

const maskToken = (t: string) => {
  if (!t) return '';
  const start = t.slice(0, 6);
  const end = t.slice(-4);
  return `${start}…${end}`;
};

export const TokenStatus: React.FC<TokenStatusProps> = ({ token, onRefresh, onReset }) => {
  const [validating, setValidating] = useState(false);
  const [lastStatus, setLastStatus] = useState<'ok' | 'error' | null>(null);
  const { toast } = useToast();

  const isFormatValid = token?.startsWith('pk.');

  const validateWithMapbox = async () => {
    if (!token) return;
    setValidating(true);
    setLastStatus(null);
    try {
      const res = await fetch(`https://api.mapbox.com/styles/v1/mapbox/dark-v11?access_token=${encodeURIComponent(token)}`);
      if (res.ok) {
        setLastStatus('ok');
        toast({ title: 'Token valid', description: 'Mapbox accepted your token.' });
      } else {
        setLastStatus('error');
        const text = await res.text();
        toast({ title: 'Validation failed', description: text || 'Mapbox rejected the token.', variant: 'destructive' });
      }
    } catch (e: any) {
      setLastStatus('error');
      toast({ title: 'Network error', description: e?.message || 'Could not reach Mapbox.', variant: 'destructive' });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="mb-4 p-3 rounded-md border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">Mapbox Token</div>
            {token ? (
              <div className="text-xs text-muted-foreground">
                Selected: <span className="font-mono">{maskToken(token)}</span> • length {token.length}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">No token set</div>
            )}
          </div>
          {token ? (
            <Badge variant={isFormatValid ? 'default' : 'destructive'} className="ml-1">
              {isFormatValid ? 'Format OK (pk.)' : 'Invalid format'}
            </Badge>
          ) : null}
          {lastStatus === 'ok' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {lastStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={validateWithMapbox} disabled={!token || validating}>
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {validating ? 'Validating…' : 'Validate token'}
          </Button>
          {onReset ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              Reset
            </Button>
          ) : null}
          <Button asChild size="sm">
            <Link to="/settings">Open Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
