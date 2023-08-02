import React, { useEffect } from 'react';
import {
  Alert,
  AlertColor,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Theme,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataStorage } from '../services/DataStorage';
import axios from 'axios';
import { Circle } from '@mui/icons-material';

let paperStyle = (theme: Theme) => ({
  backgroundColor: "#111827",
  color: 'darkGray',
  padding: theme.spacing(2),
});

let textFieldStyle = (theme: Theme) => {
  return {
    color: 'darkGray',
    padding: theme.spacing(2),
  };
}



export default function Discord() {
  const { url, discordStatus, setDiscordStatus, discordToken, setDiscordToken, channelID, setChannelID} = React.useContext(DataStorage);
  const theme = useTheme();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('success');

  useEffect(() => {
    getData().then();
  }, []);

  async function getData() {
    axios.get(url+'/get_config').then(res => {
      if(res.status === 200){
        setDiscordToken(res.data.DiscordToken);
        setChannelID(res.data.ChannelID);
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setDiscordStatus(res.data.discord_status);
      }
    });
  }


  function onChangeDiscordToken(event: React.ChangeEvent<HTMLInputElement>) {
    setDiscordToken(event.target.value);
    axios.post(url+'/update_config',{
      DiscordToken : event.target.value
    })
  }


  function onChangeChannelID(event: React.ChangeEvent<HTMLInputElement>) {
    setChannelID(event.target.value);
    axios.post(url+'/update_config',{
      ChannelID : event.target.value
    })
  }


  function getColorCircle(discordStatus: string) {
    switch (discordStatus) {
      case "ONLINE":
        return "green";
      case "OFFLINE":
        return "red";
    }
  }

  function pressStartDiscord() {
    axios.post(url+'/start_discord_bot').then(res => {
      if(res.status === 204){
          setSnackbarMessage("Started Discord Bot!");
          setSnackbarOpen(true);
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setDiscordStatus(res.data.discord_status);
      }
    });
  }

  function pressStopDiscord() {
    axios.post(url+'/stop_discord_bot').then(res => {
      if(res.status === 204){
        setSnackbarMessage("Stopped Discord Bot!");
        setSnackbarOpen(true);
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setDiscordStatus(res.data.discord_status);
      }
    });
  }

  return (
    <div>
      <Paper sx={paperStyle(theme)}>
        <Container>
          <Grid container spacing={2}>
            <Grid item key={"discordToken"} xs={8}>
              <TextField
                id={"discordTokenInput"}
                label={"Discord Token"}
                value={discordToken}
                onChange={onChangeDiscordToken}
                fullWidth={true}
                variant={"outlined"}
                color={"secondary"}
                inputProps={{
                  style: textFieldStyle(theme),
                }}
                sx={{
                  marginBottom: theme.spacing(2),
                }}
                focused={true}
              />
            </Grid>
            <Grid item key={"channelIDGrid"} xs={5}>
              <TextField
                id={"channelIDInput"}
                label={"Channel ID"}
                value={channelID}
                onChange={onChangeChannelID}
                fullWidth={true}
                variant={"outlined"}
                color={"secondary"}
                inputProps={{
                  style: textFieldStyle(theme),
                }}
                sx={{
                  marginBottom: theme.spacing(2),
                }}
                focused={true}
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <div style={{paddingTop: theme.spacing(3)}}>
        <Paper sx={paperStyle(theme)}>
          <Container>
            <Grid container spacing={1}>
              <Grid item key={"discordStatus"} xs={4}>
                <Typography variant={"body1"} sx={{paddingTop: theme.spacing(1)}}>
                  Discord Status: {discordStatus}
                </Typography>
              </Grid>
              <Grid item key={"discordStatusIcon"} xs={1}>
                <Circle sx={{ color: getColorCircle(discordStatus), paddingTop: theme.spacing(1)}}/>
              </Grid>
              <Grid item key={"emptySpace"} xs={3}/>
            <Grid item key={"startButton"} xs={1}>
              <Button
                sx={{
                  fontWeight: 'bolder',
                  border: '0px',
                  color: 'white',
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    border: '0px',
                    backgroundColor: '#1b5e20',
                  },
                }}
                disabled={discordStatus === "ONLINE"}
                variant={"outlined"}
                color={"secondary"}
                onClick={pressStartDiscord}
              >
                Start
              </Button>
            </Grid>
              <Grid item key={"emptySpace1"} xs={1}/>
          <Grid item key={"stopButton"} xs={1}>
            <Button
              sx={{
                fontWeight: 'bolder',
                border: '0px',
                color: 'white',
                backgroundColor: '#c62828',
                '&:hover': {
                  border: '0px',
                  backgroundColor: '#961d1d',
                },
              }}
              disabled={discordStatus === "OFFLINE"}
              variant={"outlined"}
              color={"secondary"}
              onClick={pressStopDiscord}
            >
              Stop
            </Button>
          </Grid>
          </Grid>
        </Container>
          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={()=> setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    sx={{paddingTop: theme.spacing(60), paddingLeft: theme.spacing(20)}}>
            <Alert onClose={()=> setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </div>
    </div>
  );
}

