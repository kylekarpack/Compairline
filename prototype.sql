SELECT DISTINCT DAY_OF_MONTH, CARRIER, avg(DEP_DELAY_NEW) as DELAY FROM prototype GROUP BY DAY_OF_MONTH, CARRIER;