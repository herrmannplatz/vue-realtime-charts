CREATE TABLE temperature (
  temperature numeric not null,
  location text not null,
  recorded_at timestamptz not null default now()
);

SELECT create_hypertable('temperature', 'recorded_at');

CREATE VIEW last_20_min_temp AS (
  SELECT time_bucket('5 seconds', recorded_at) AS five_sec_interval,
  location,     
    MAX(temperature) AS max_temp
  FROM temperature
  WHERE recorded_at > NOW() - interval '20 minutes'    
  GROUP BY five_sec_interval, location    
  ORDER BY five_sec_interval ASC
);