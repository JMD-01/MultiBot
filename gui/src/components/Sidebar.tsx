import {
  AndroidOutlined,
  CallSplitOutlined,
  ChatOutlined,
  DesktopWindowsOutlined,
  EmailOutlined,
  ListAltOutlined,
  MicOutlined,
  MouseOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
  TimelineOutlined
} from '@mui/icons-material';
import RepeatOnOutlinedIcon from '@mui/icons-material/RepeatOnOutlined';
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Theme, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

let drawerStyle = (theme: Theme) =>{
  return {
    width: 200,
    overflow: 'hidden',
    backgroundColor: '#111827'
  };
}

let drawerCategory = (theme: Theme) =>{
  return {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#111827',
    color: 'gray',
    draggable: false,
    userSelect: 'none',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  };
}
let drawerItem = (theme: Theme) =>{
  return {
    paddingTop: 0,
    paddingBottom: 0,
    color: 'darkGray',
    fontWeight: 'bold',
     '&:hover': {
       backgroundColor: '#242A38',
     },
  };
}

let drawerItemActive = (theme: Theme) =>{
  return {
    paddingTop: 0,
    paddingBottom: 0,
    color: '#10B981',
    fontWeight: 'bold',
    backgroundColor: '#242A38',
    '&:hover': {
      backgroundColor: '#242A38',
    },
  };
}

let drawerItemIcon = (theme: Theme) =>{
  return {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    color: 'darkGray',
  };
}

let drawerItemIconActive = (theme: Theme) =>{
  return {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    color: '#10B981',
  };
}

export default function Sidebar(){
  const theme = useTheme();
  const history = useHistory();
  const [urlPath, setUrlPath] = React.useState(location.pathname);

  return (
    <div>
      <Drawer
        sx={drawerStyle(theme)}
        variant="permanent"
        anchor="left"
        PaperProps={{
          sx: drawerStyle(theme)
        }}
      >
        <Toolbar />
        {/* links/list section */}
        <List disablePadding>
          {

            categories.map((category: string) =>(
              <div key={category}>
                <ListSubheader
                  // @ts-ignore
                  sx={
                    drawerCategory(theme)
                  }
                >{category}</ListSubheader>
                {tabs.map((item : tabType) => {
                  if(item.category == category){
                    return(
                      <ListItem
                        button
                        key={item.title}
                        sx={
                          urlPath === item.path ?  drawerItemActive(theme):drawerItem(theme)
                        }
                        onClick={() => {history.push(item.path);setUrlPath(item.path)}}
                      >
                        <ListItemIcon sx={ urlPath === item.path ?  drawerItemIconActive(theme): drawerItemIcon(theme)}>{item.icon}</ListItemIcon>
                        <ListItemText disableTypography>{item.title}</ListItemText>
                      </ListItem>
                    )
                  }
                })}
              </div>
            ))
          }
        </List>
      </Drawer>
    </div>
  )


}

interface tabType {
  title: string,
  icon: JSX.Element,
  category: string,
  path: string
}

const categories = ["INFORMATION","SETTINGS","CONTROLS","MACRO"];

const tabs = [
  //Information tabs
  {
    title: "Changelog",
    icon: <EmailOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "INFORMATION",
    path: "/Changelog"
  },
  {
    title: "Specification",
    icon: <DesktopWindowsOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "INFORMATION",
    path: "/Specs"
  },
  //Settings tabs
  {
    title: "General",
    icon: <SettingsOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "SETTINGS",
    path: "/General"
  },
  {
    title: "Bots",
    icon: <AndroidOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "SETTINGS",
    path: "/Bots"
  },
  {
    title: "Proxy",
    icon: <CallSplitOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "SETTINGS",
    path: "/Proxy"
  },
  {
    title: "Discord",
    icon: <MicOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "SETTINGS",
    path: "/Discord"
  },
  //Controls
  {
    title: "Movements",
    icon: <TimelineOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "CONTROLS",
    path: "/Movement"
  },
  {
    title: "Botting",
    icon: <PersonOutlineOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "CONTROLS",
    path: "/Botting"
  },
  {
    title: "Chat",
    icon: <ChatOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "CONTROLS",
    path: "/Chat"
  },
  {
    title: "Inventory",
    icon: <ListAltOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "CONTROLS",
    path: "/Inventory"
  },
  //Macros
  {
    title: "Basic",
    icon: <MouseOutlined sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "MACRO",
    path: "/Basic"
  },
  {
    title: "Plugins",
    icon: <RepeatOnOutlinedIcon sx={{ color: 'inherit' , fontWeight: 'inherit'}} />,
    category: "MACRO",
    path: "/Plugins"
  },
]
