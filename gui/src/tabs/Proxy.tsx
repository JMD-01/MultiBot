import React, { useEffect } from 'react';
import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  TextField,
  Theme
} from '@mui/material';
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

export default function Proxy() {
  const {url, proxy, setProxy, proxyPath, setProxyPath, proxyType, setProxyType, altsPerProxy, setAltsPerProxy} = React.useContext(DataStorage);
  const theme = useTheme();

  useEffect(() => {
    getData().then();
  }, []);

  async function getData() {
    axios.get(url+'/get_config').then(res => {
      if(res.status === 200){
        setProxy(res.data.Proxy);
        setProxyType(res.data.ProxyType);
        setAltsPerProxy(res.data.AltsPerProxy);
        setProxyPath(res.data.ProxyFilePath);
      }
    });
  }

  function onChangeProxy(event: React.ChangeEvent<HTMLInputElement>) {
    axios.post(url+'/update_config', {
      Proxy: event.target.checked,
    });
    setProxy(event.target.checked);
  }

  let proxyTypes = ["SOCKS5", "SOCKS4", "HTTP"];

  function onChangeProxyType(input: string | null) {
    if(input === null){
      return;
    }
    setProxyType(input);
    axios.post(url+'/update_config',{
      ProxyType : input
    })
  }

  function onChangeAltsPerProxy(event: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);
    if(value < 1 && value > 10000){
      return;
    }
    axios.post(url+'/update_config', {
      AltsPerProxy: value,
    });
    setAltsPerProxy(value);
  }

  function openFileDialog(){
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = "text/plain";

    // @ts-ignore
    input.onchange = () => {
      if(input.files && input.files.length === 1){
        setProxyPath(input.files[0].path);
        axios.post(url+'/update_config',{
          ProxyFilePath : input.files[0].path
        })
      }
    }
    input.click();
  }

  function onChangeProxyPath(event: React.ChangeEvent<HTMLInputElement>) {
    setProxyPath(event.target.value);
    axios.post(url+'/update_config',{
      ProxyFilePath : event.target.value
    })
  }

  return(
    <div>
      <Paper sx={paperStyle(theme)}>
        <Container>
          <Grid container spacing={2}>
            <Grid item key={"proxyToggle"} xs={3}>
              <FormGroup sx={{paddingTop: theme.spacing(1), color : "darkGray"}}>
                <FormControlLabel label="Proxy" control={
                  <Checkbox
                    sx={{
                      color: "#4782DA",
                    }}
                    checkedIcon={<CheckBoxIcon sx={{color: "#4782DA"}}/>}
                    onChange={onChangeProxy}
                    checked={proxy}
                  />
                }/>
              </FormGroup>
            </Grid>
            <Grid item key={"proxyType"} xs={3}>
              <Autocomplete
                id={"proxyTypeInput"}
                onChange={(event: any, newValue: string | null) => {
                  onChangeProxyType(newValue);
                }}
                value={proxyType}
                fullWidth={false}
                color={"primary"}
                sx={{
                  marginBottom: theme.spacing(2),
                }}
                disableClearable={true}
                options={proxyTypes}
                renderInput={(params) => (
                  <TextField {...params}
                             label="Proxy Type"
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
            <Grid item key={"emptySpace"} xs={1}/>
            <Grid item key={"altsPerProxy"} xs={3}>
              <TextField
                id={"altsPerProxyInput"}
                label={"Accounts per proxy"}
                value={altsPerProxy}
                type={"number"}
                onChange={onChangeAltsPerProxy}
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
            <Grid item key={"proxyPathGrid"} xs={10}>
              <TextField
                id={"proxyPathInput"}
                label={"Proxy Path(IP:PORT:USERNAME:PASSWORD)"}
                value={proxyPath}
                fullWidth={true}
                variant={"outlined"}
                color={"secondary"}
                onChange={onChangeProxyPath}
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
    </div>
  )
}
