import React, { useEffect } from 'react';
// import { mockData } from '../data/mockData';
import {fetchRuns} from '../api/api';
import { RunsResponse } from '../types/api';
import { APIError } from '../api/api';

export const ProtocolListTestPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = React.useState<[RunsResponse] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = async () => {
        console.log('Component mounted');
        try {
          const result = await fetchRuns();
          console.log(result);
          setData(result);
        } catch (err) {
          if (err instanceof APIError) {
            setError(`API Error: ${err.message} (Status: ${err.status || 'unknown'})`);
          } else {
            setError(`Unexpected error: ${(err as Error).message}`);
          }
        } finally {
          setLoading(false);
        }
      };
  useEffect(() => {
        fetchData();
      }, []);

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div>
      <main>
        <pre>
          /* dataを表示 */
          {JSON.stringify(data, null, 2)}
        </pre>
      </main>
    </div>
  );
};