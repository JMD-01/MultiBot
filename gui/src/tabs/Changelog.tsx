import React, { useContext, useEffect } from 'react';
import { Container, Grid, Paper, Theme, Typography } from '@mui/material';
import { DataStorage } from '../services/DataStorage';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

let paperStyle = (theme: Theme) => ({
  backgroundColor: "#111827",
  color: 'darkGray',
});

function getPaperInfo(changelog: ChangeLog) {

  return(
    <Container>
      <Typography variant="h6">
        {`${changelog.name} - V${changelog.version}`}
      </Typography>
      <Typography variant="caption" gutterBottom component="div">
        {`Released on: ${new Date(changelog.date).toLocaleString()} by ProZed`}
      </Typography>
      {changelog.changes.map(change =>
      <Typography key={change.trim()+changelog.version.trim()}variant="body1">
        {"-"+change}
      </Typography>
      )}
    </Container>
  )

}
export interface ChangeLog {
  name: string,
  version: string,
  date: number,
  author: string,
  changes: string[]
}

export default function Changelog() {
  const { url, changelogs, setChangelogs} = useContext(DataStorage);
  const theme = useTheme();


  useEffect(() => {
    getData().then();
  }, []);

  async function getData(){
    if(changelogs.length === 0){
      axios.get(url+"/get_changelog").then(response => {
        let responseCode = response.status;
        if(responseCode === 200){
          setChangelogs(response.data);
        }
      });
    }
  }

  return(
      <Container>
        <Grid container spacing={3} >
          {changelogs.map(change => (
            <Grid item key={change.version} xs={12}>
              <Paper sx={paperStyle(theme)}>{getPaperInfo(change)}</Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
  )
}
