import React, { useEffect } from 'react';
import {
  Alert,
  AlertColor,
  Autocomplete,
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



export default function General() {
  const {
    accountFilePath,
    setAccountFilePath,
    url,
    serverIP,
    setServerIP,
    serverPort,
    setServerPort,
    version,
    setVersion,
    botStatus,
    setBotStatus
  } = React.useContext(DataStorage);
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
        setAccountFilePath(res.data.AccountPath);
        setServerIP(res.data.ServerIP);
        setServerPort(res.data.Port);
        setVersion(res.data.Version);
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setBotStatus(res.data.bot_status);
      }
    });
  }
  function openFileDialog(){
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = "text/plain";

    // @ts-ignore
    input.onchange = () => {
      if(input.files && input.files.length === 1){
          setAccountFilePath(input.files[0].path);
          axios.post(url+'/update_config',{
            AccountPath : input.files[0].path
          })
      }
    }
    input.click();
  }


  function onChangeAccountPath(event: React.ChangeEvent<HTMLInputElement>) {
    setAccountFilePath(event.target.value);
    axios.post(url+'/update_config',{
      AccountPath : event.target.value
    })
  }

  function onChangeServerIP(event: React.ChangeEvent<HTMLInputElement>) {
    let allowedChars = "0123456789._-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(event.target.value.length > 255){
      return;
    }
    for (const element of event.target.value) {
      if(!allowedChars.includes(element)){
        return;
      }
    }
    setServerIP(event.target.value);
    axios.post(url+'/update_config',{
      ServerIP : event.target.value
    })
  }

  function onChangePort(event: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);
    if(value < 0 && value > 65537){
      return;
    }
    setServerPort(value);
    axios.post(url+'/update_config',{
      Port : value
    })
  }

  let versionOptions = ["1.8"]
  function onChangeVersion(input: string | null) {
    if(input === null){
      return;
    }
    setVersion(input);
    axios.post(url+'/update_config',{
      Version : input
    })
  }

  function pressStartPause(mode: string) {
    switch(mode){
      case "START":
        axios.post(url+'/start_bot').then(res => {
          if(res.status === 200){
            if(res.data.status === true){
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('success');
            } else if(res.data.status === false){
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('warning');
            } else if(res.data.status === null){
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('error');
            }
          }
        });
        break;
      case "PAUSE":
        axios.post(url+'/pause_bot').then(res => {
          if(res.status === 200){
            if(res.data.status === true){
              setBotStatus("PAUSED");
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('success');
            }else if(res.data.status === false){
              setBotStatus("ONLINE");
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('warning');
            } else if(res.data.status === null){
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('error');
            }
          }
        });
        break;
      case "RESUME":
        axios.post(url+'/pause_bot').then(res => {
          if(res.status === 200){
            if(res.data.status === true){
              setBotStatus("PAUSED");
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('warning');
            }else if(res.data.status === false){
              setBotStatus("ONLINE");
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('success');
            } else if(res.data.status === null){
              setSnackbarMessage(res.data.message);
              setSnackbarOpen(true);
              setSnackbarSeverity('error');
            }
          }
        });
        break;
    }
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setBotStatus(res.data.bot_status);
      }
    });
  }

  function pressStop() {
    axios.post(url+'/stop_bot').then(res => {
      if(res.status === 200){
        if(res.data.status === true){
          setBotStatus("OFFLINE");
          setSnackbarMessage(res.data.message);
          setSnackbarOpen(true);
        }else if(res.data.status === false){
          setBotStatus("OFFLINE");
          setSnackbarMessage(res.data.message);
          setSnackbarOpen(true);
        } else if(res.data.status === null){
          setSnackbarMessage(res.data.message);
          setSnackbarOpen(true);
        }
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setBotStatus(res.data.bot_status);
      }
    });
  }

  function getColorCircle(botStatus: string) {
    switch (botStatus) {
      case "ONLINE":
        return "green";
      case "PAUSED":
        return "orange";
      case "OFFLINE":
        return "red";
    }
  }

  return (
    <div>
    <Paper sx={paperStyle(theme)}>
      <Container>
        <Grid container spacing={2}>
          <Grid item key={"serverIPGrid"} xs={8}>
            <TextField
              id={"serverIPInput"}
              label={"Server IP"}
              value={serverIP}
              onChange={onChangeServerIP}
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
          <Grid item key={"portGrid"} xs={4}>
            <TextField
              id={"portInput"}
              label={"Port"}
              value={serverPort}
              onChange={onChangePort}
              fullWidth={true}
              type={"number"}
              variant={"outlined"}
              color={"secondary"}
              inputProps={{
                style: textFieldStyle(theme),
                max: 65535,
                min: 0,
              }}
              sx={{
                marginBottom: theme.spacing(2),
              }}
              focused={true}
            />
          </Grid>
          <Grid item key={"versionGrid"} xs={2}>
            <Autocomplete
              id={"versionInput"}
              onChange={(event: any, newValue: string | null) => {
                onChangeVersion(newValue);
              }}
              value={version}
              fullWidth={false}
              color={"primary"}
              sx={{
                marginBottom: theme.spacing(2),
              }}
              disableClearable={true}
             options={versionOptions}
              renderInput={(params) => (
                <TextField {...params}
                           label="Version"
                           variant="outlined"
                           color="secondary"
                           inputProps={{
                             ...params.inputProps,
                             style: { color: "darkGray" },
                             readOnly: true
                           }}
                           focused={true}
                />
              )}
            />
          </Grid>
          <Grid item key={"versionEmptySpace"} xs={10}/>
          <Grid item key={"accountPathGrid"} xs={10}>
            <TextField
              id={"accountPathInput"}
              label={"Account Path(EMAIL:PASSWORD:ACCOUNT TYPE)"}
              value={accountFilePath}
              fullWidth={true}
              variant={"outlined"}
              color={"secondary"}
              onChange={onChangeAccountPath}
              inputProps={{
                style: textFieldStyle(theme)
              }}
              sx={{
                marginBottom: theme.spacing(2),
              }}
              focused={true}
            />
          </Grid>
          <Grid item key={"accountChooseFileGrid"} xs={2}>
            <Button
              sx={{
                left: theme.spacing(2),
                top: theme.spacing(1.3),
                fontWeight: 'bolder',
                border: '0px',
                color: 'white',
                backgroundColor: '#4782DA',
                '&:hover': {
                  border: '0px',
                  backgroundColor: '#396bb6',
                },
              }}
              variant={"outlined"}
              color={"secondary"}
              onClick={openFileDialog}
            >
              Select
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Paper>
      <div style={{paddingTop: theme.spacing(3)}}>
        <Paper sx={paperStyle(theme)}>
          <Container>
            <Grid container spacing={1}>
                <Grid item key={"botsAmount"} xs={4}>
                  <Typography variant={"body1"} sx={{paddingTop: theme.spacing(1)}}>
                        Bots Online: 0
                    </Typography>
                </Grid>
              <Grid item key={"botsStatus"} xs={3}>
                <Typography variant={"body1"} sx={{paddingTop: theme.spacing(1)}}>
                  Bot Status: {botStatus}
                </Typography>
              </Grid>
              <Grid item key={"botsStatusIcon"} xs={1}>
                <Circle sx={{ color: getColorCircle(botStatus), paddingTop: theme.spacing(1)}}/>
              </Grid>
              <Grid item key={"startPauseButton"} xs={2}>
                {botStatus === "OFFLINE" &&
                <Button
                  sx={{
                    fontWeight: 'bolder',
                    border: '0px',
                    color: 'white',
                    backgroundColor: "#2e7d32",
                    '&:hover': {
                      border: '0px',
                      backgroundColor: '#1b5e20',
                    },
                  }}
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => pressStartPause("START")}
                >
                  Start
                </Button>
                }
                {botStatus === "PAUSED" &&
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
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => pressStartPause("RESUME")}
                >
                  Resume
                </Button>
                }
                {botStatus === "ONLINE" &&
                <Button
                  sx={{
                    fontWeight: 'bolder',
                    border: '0px',
                    color: 'white',
                    backgroundColor: '#ed6c02',
                    '&:hover': {
                      border: '0px',
                      backgroundColor: '#e65100',
                    },
                  }}
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => pressStartPause("PAUSE")}
                >
                  Pause
                </Button>
                }
              </Grid>
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
                  disabled={botStatus === "OFFLINE"}
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={pressStop}
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

