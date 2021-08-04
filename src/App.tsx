import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import RouterApp from 'routes';

const theme = createTheme({
    palette: {
        primary: {
            main: "#7721AD",
            dark: "#381052",
            light: "#7721AD",
			contrastText: "#fff",
        },
        secondary: {
            main: "#FFFFFF",
            light: "#FFFFFF",
            dark: "#FFFFFF",
			contrastText: "#000",
        },
		text: {
			primary: "#2E2C34",
			secondary: "#2E2C34",
		},
    },
	typography: {
		fontFamily: 'dm-sans',
	},
	overrides: {
		MuiSvgIcon: {
			root: { color: "#8F92A1", width: 24, height: 24, minWidth: 0 },
		},
		MuiListItemIcon: {
			root: { minWidth: 38 },
		},
		MuiListItem: {
			gutters: { paddingLeft: 28 }
		},
	}
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<RouterApp />
			</div>
		</ThemeProvider>
	);
}

export default App;
