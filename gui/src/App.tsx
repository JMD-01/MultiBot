import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Changelog, { ChangeLog } from './tabs/Changelog';
import Bots from './tabs/Bots';
import Layout from './components/Layout';
import { DataStorage } from './services/DataStorage';
import Specification, { InitialSystemInfo } from './tabs/Specification';
import axios from 'axios';
import General from './tabs/General';
import Proxy from './tabs/Proxy';
import Discord from './tabs/Discord';

function App() {
  const [url, setUrl] = React.useState('http://localhost:'+process.env.REACT_APP_PORT);
  const [port, setPort] = React.useState(process.env.REACT_APP_PORT);
  const [changelogs, setChangelogs] = React.useState<ChangeLog[]>([]);
  const [systemSpecs, setSystemSpecs] = React.useState<InitialSystemInfo>();
  const [accountFilePath, setAccountFilePath] = React.useState('');
  const [serverIP, setServerIP] = React.useState('');
  const [serverPort, setServerPort] = React.useState(25565);
  const [version, setVersion] = React.useState('1.8');
  const [botStatus, setBotStatus] = React.useState('OFFLINE');
  const [discordStatus, setDiscordStatus] = React.useState('OFFLINE');
  const [joinCommand, setJoinCommand] = React.useState('');
  const [joinSpeed, setJoinSpeed] = React.useState(5000);
  const [botAmount, setBotAmount] = React.useState(10);
  const [physics, setPhysics] = React.useState(false);
  const [proxy, setProxy] = React.useState(false);
  const [proxyType, setProxyType] = React.useState('SOCKS5');
  const [altsPerProxy, setAltsPerProxy] = React.useState(5);
  const [proxyPath, setProxyPath] = React.useState('');
  const [discordToken, setDiscordToken] = React.useState('');
  const [channelID, setChannelID] = React.useState('');

  useEffect(() => {
    getData().then();
  }, []);

  async function getData(){
    if(systemSpecs === undefined){
      axios.get(url+'/get_specs_data').then(res => {
        if(res.status === 200){
          setSystemSpecs(res.data);
        }
      });
    }
    axios.get(url+'/get_config').then(res => {
      if(res.status === 200){
        setAccountFilePath(res.data.AccountPath);
        setServerIP(res.data.ServerIP);
        setServerPort(res.data.Port);
        setVersion(res.data.Version);
        setJoinCommand(res.data.JoinCommand);
        setJoinSpeed(res.data.JoinSpeed);
        setBotAmount(res.data.BotCount);
        setPhysics(res.data.Physics);
        setProxy(res.data.Proxy);
        setProxyType(res.data.ProxyType);
        setAltsPerProxy(res.data.AltsPerProxy);
        setProxyPath(res.data.ProxyFilePath);
        setDiscordToken(res.data.DiscordToken);
        setChannelID(res.data.ChannelID);
      }
    });
    axios.get(url+'/get_bot_status').then(res => {
      if(res.status === 200){
        setBotStatus(res.data.bot_status);
        setDiscordStatus(res.data.discord_status);
      }
    });
  }
  return (
    <DataStorage.Provider value={{
      url: url,
      port: port,
      changelogs: changelogs,
      setChangelogs: setChangelogs,
      systemSpecs: systemSpecs,
      accountFilePath: accountFilePath,
      setAccountFilePath: setAccountFilePath,
      serverIP: serverIP,
      setServerIP: setServerIP,
      serverPort: serverPort,
      setServerPort: setServerPort,
      version: version,
      setVersion: setVersion,
      botStatus: botStatus,
      setBotStatus: setBotStatus,
      discordStatus: discordStatus,
      setDiscordStatus: setDiscordStatus,
      joinCommand: joinCommand,
      setJoinCommand: setJoinCommand,
      joinSpeed: joinSpeed,
      setJoinSpeed: setJoinSpeed,
      botAmount: botAmount,
      setBotAmount: setBotAmount,
      physics: physics,
      setPhysics: setPhysics,
      proxy: proxy,
      setProxy: setProxy,
      proxyType: proxyType,
      setProxyType: setProxyType,
      altsPerProxy: altsPerProxy,
      setAltsPerProxy: setAltsPerProxy,
      proxyPath: proxyPath,
      setProxyPath: setProxyPath,
      discordToken: discordToken,
      setDiscordToken: setDiscordToken,
      channelID: channelID,
      setChannelID: setChannelID
    }
    }>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/Changelog" component={Changelog} />
            <Route exact path="/Specs" component={Specification} />
            <Route exact path="/General" component={General}/>
            <Route exact path="/Bots" component={Bots} />
            <Route exact path="/Proxy" component={Proxy} />
            <Route exact path="/Discord" component={Discord} />
          </Switch>
        </Layout>
      </Router>
    </DataStorage.Provider>
  );
}

export default App;
