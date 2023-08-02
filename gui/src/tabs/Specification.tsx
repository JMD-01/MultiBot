import React from 'react';
import { Box, CircularProgress, Container, Grid, Paper, Theme, Typography } from '@mui/material';
import { DataStorage } from '../services/DataStorage';
import { useTheme } from '@mui/material/styles';


let paperStyle = (theme: Theme) => ({
  backgroundColor: "#111827",
  color: 'darkGray',
});

let paperStyleLoading = (theme: Theme) => ({
  backgroundColor: "#111827",
  color: 'darkGray',
  textAlign: 'center',
  padding: theme.spacing(2)
});
function SpecsCard(input: OSData| CpuInfo | BiosInfo, title: string) {
  return (
    <Container>
      <Typography variant="h6">
        {title}
      </Typography>
      {Object.entries(input).map(key =>
        <Typography variant="subtitle1">
          {capitalizeFirstLetter(key[0])}: {key[1]}
        </Typography>
      )}
    </Container>
    );
}
function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export default function Specification() {
  const {systemSpecs} = React.useContext(DataStorage);
  const theme = useTheme();

  return(
    <div>
      <div>
        {systemSpecs !== undefined &&
        <Container>
          <Grid container spacing={3}>
            <Grid item key={"osdata"} xs={6}>
              <Paper sx={paperStyle(theme)}>
              {SpecsCard(systemSpecs.OSData, "Operating System")}
              </Paper>
            </Grid>
            <Grid item key={"cpuinfo"} xs={6}>
              <Paper sx={paperStyle(theme)}>
              {SpecsCard(systemSpecs.CpuInfo, "CPU Information")}
              </Paper>
            </Grid>
            <Grid item key={"biosinfo"} xs={6}>
              <Paper sx={paperStyle(theme)}>
                {SpecsCard(systemSpecs.BiosInfo, "BIOS Information")}
              </Paper>
            </Grid>
          </Grid>
        </Container>
        }
      </div>
      <div>
        {systemSpecs === undefined &&
        <div
          style={{
            position: 'absolute', left: '60%', top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Paper>
            <Box sx={paperStyleLoading(theme)}>
              <CircularProgress />
              <Typography variant="h6">
                Loading
              </Typography>
            </Box>
          </Paper>
        </div>
        }
      </div>
    </div>

  )
}

export interface InitialSystemInfo {
  OSData: OSData,
  CpuInfo: CpuInfo,
  BiosInfo: BiosInfo
}
export interface OSData {
  platform: string,
  distro: string,
  release: string,
  arch: string,
  hostname: string,
  username: string,
  build: string,
  pid: string,
  node: string,
  disk: string,
  diskSize: string
}
export interface CpuInfo {
  manufacturer: string,
  brand: string,
  vendor: string,
  revision: string,
  ram: string,
  speed: string,
  cores: string,
  physicalCores: string,
  processors: string,
  socket: string,
  virtualization: string
}
export interface BiosInfo{
  manufacturer: string,
  model: string,
  vendor: string,
  releaseDate: string
}
