import React, { useEffect } from 'react';
import { Checkbox, Container, FormControlLabel, FormGroup, Grid, Paper, TextField, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DataStorage } from '../services/DataStorage';
import axios from 'axios';


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

export default function Bots() {
  const {joinCommand, setJoinCommand, joinSpeed, setJoinSpeed, botAmount, setBotAmount, physics, setPhysics, url} = React.useContext(DataStorage);
  const theme = useTheme();

  useEffect(() => {
    getData().then();
  }, []);

  async function getData() {
    axios.get(url+'/get_config').then(res => {
      if(res.status === 200){
        setJoinCommand(res.data.JoinCommand);
        setJoinSpeed(res.data.JoinSpeed);
        setBotAmount(res.data.BotCount);
        setPhysics(res.data.Physics);
      }
    });
  }
  function onChangeJoinCommand(event: React.ChangeEvent<HTMLInputElement>) {
    axios.post(url+'/update_config', {
      JoinCommand: event.target.value,
    });
    setJoinCommand(event.target.value);
  }

  function onChangeJoinSpeed(event: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);
    if(value < 1 && value > 9999999999999){
      return;
    }
    axios.post(url+'/update_config', {
      JoinSpeed: value,
    });
    setJoinSpeed(value);
  }

  function onChangeBotCount(event: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);
    if(value < 1 && value > 10000){
      return;
    }
    axios.post(url+'/update_config', {
      BotCount: value,
    });
    setBotAmount(value);
  }

  function onChangePhysics(event: React.ChangeEvent<HTMLInputElement>) {
    axios.post(url+'/update_config', {
      Physics: event.target.checked,
    });
    setPhysics(event.target.checked);
  }

  return(
    <div>
      <Paper sx={paperStyle(theme)}>
        <Container>
          <Grid container spacing={2}>
            <Grid item key={"joinCommand"} xs={8}>
              <TextField
                id={"joinCommandInput"}
                label={"Join Command"}
                value={joinCommand}
                onChange={onChangeJoinCommand}
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
            <Grid item key={"joinSpeed"} xs={4}>
              <TextField
                id={"joinSpeedInput"}
                label={"Join Speed(ms)"}
                value={joinSpeed}
                type={"number"}
                onChange={onChangeJoinSpeed}
                fullWidth={true}
                variant={"outlined"}
                color={"secondary"}
                inputProps={{
                  style: textFieldStyle(theme),
                  min: 1,
                  max: 9999999999999,
                }}
                sx={{
                  marginBottom: theme.spacing(2),
                }}
                focused={true}
              />
            </Grid>
            <Grid item key={"botCount"} xs={3}>
              <TextField
                id={"botCountInput"}
                label={"Bot Amount"}
                value={botAmount}
                type={"number"}
                onChange={onChangeBotCount}
                fullWidth={true}
                variant={"outlined"}
                color={"secondary"}
                inputProps={{
                  style: textFieldStyle(theme),
                  min: 1,
                  max: 10000,
                }}
                sx={{
                  marginBottom: theme.spacing(2),
                }}
                focused={true}
              />
            </Grid>
            <Grid item key={"physics"} xs={3}>
              <FormGroup sx={{paddingTop: theme.spacing(1), paddingLeft: theme.spacing(3), color : "darkGray"}}>
                <FormControlLabel label="Physics" control={
                  <Checkbox
                  sx={{
                    color: "#4782DA",
                  }}
                  checkedIcon={<CheckBoxIcon sx={{color: "#4782DA"}}/>}
                  onChange={onChangePhysics}
                  checked={physics}
                  />
                }/>
              </FormGroup>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </div>
  )
}
