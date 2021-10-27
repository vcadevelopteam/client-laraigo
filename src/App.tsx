import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core';
import RouterApp from 'routes';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'lang';

const theme = createTheme({
	direction: 'ltr',
    palette: {
        primary: {
            main: "#7721AD",
            dark: "#381052",
            light: "#aa53e0",
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
			secondary: "#B6B4BA",
		},
    },
	typography: {
		fontFamily: 'dm-sans',
	},
	overrides: {
		MuiSvgIcon: {
			root: { width: 24, height: 24, minWidth: 0 },
		},
		MuiListItemIcon: {
			root: { minWidth: 38 },
		},
		MuiListItem: {
			gutters: { paddingLeft: 25 }
		},
		MuiTypography: {
			body1: { fontSize: 14 }
		},
		// MuiButtonBase: {
		// 	root: { minHeight: 48 },
		// },
		MuiButton: {
			root: { minHeight: 40, minWidth: 100, height: 40, textTransform: 'initial', fontSize: '14px', padding: 12,
			fontWeight: 500,},
			label: { fontWeight: 600, fontSize: 14, fontStyle: 'normal' },
		},
		MuiTabs: {
			fixed: {
				flexWrap: 'inherit',
			},
			flexContainer: {
				flexWrap: 'inherit',
			}
		},
		MuiDivider: {
			root: {
				backgroundColor: '#EBEAED',
			},
		},
	}
});

i18n.use(initReactI18next).init({
	resources,
	lng: navigator.language,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
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
