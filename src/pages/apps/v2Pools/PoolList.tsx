// src\pages\apps\v2Pools\PoolList.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/store';
import { fetchPools } from 'src/store/apps/v2Pools';
import { List, ListItem, Typography, IconButton, Box, useTheme } from '@mui/material';
import Icon from 'src/@core/components/icon'

const PoolList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pools = useSelector((state: RootState) => state.pools.data);
  const [priceToggle, setPriceToggle] = useState<Record<number, boolean>>({});
  const theme = useTheme();

  useEffect(() => {
    if (pools.length === 0) {
      dispatch(fetchPools());
    }
  }, [dispatch, pools.length]);

  const handlePriceToggle = (poolId: number) => {
    setPriceToggle(prevState => ({ ...prevState, [poolId]: !prevState[poolId] }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Pools List</Typography>
      <List>
        {pools.map((pool, index) => {
          const isToggled = priceToggle[pool.id];
          const priceRatio = isToggled ? pool.tokenAReserve / pool.tokenBReserve : pool.tokenBReserve / pool.tokenAReserve;

          return (
            <ListItem key={pool.id} divider sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing(2) }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div">{`Pool ${index + 1}: ${pool.tokenA}/${pool.tokenB}`}</Typography>
                <Typography variant="body1" component="div">{`Total LP Tokens: ${pool.totalLPTokenSupply}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                <Typography variant="h6" component="div">
                  {isToggled ? `1 ${pool.tokenB} = ${priceRatio.toFixed(6)} ${pool.tokenA}` : `1 ${pool.tokenA} = ${priceRatio.toFixed(6)} ${pool.tokenB}`}
                </Typography>
                <IconButton onClick={() => handlePriceToggle(pool.id)}>
                  <Icon icon='ri:exchange-line' fontSize={20} />
                </IconButton>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default PoolList;
