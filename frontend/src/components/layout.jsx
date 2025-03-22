import { Box, styled } from '@mui/material';
import { Header } from './header';

export const AppBarHeight = '100px';

export const DrawerHeader = styled('div')(({ theme }) => ({
	height: `calc(${AppBarHeight} + 5px)`,
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export const DrawerContentContainer = styled(Box)(() => ({
	width: '100%',
	minHeight: '100vh',
	background: '#f1f4f2',
}));

export const Layout = ({ children, title, subtitle, buttonInfo, AddResource, refreshResource, setConfirmation }) => {
	return (
		<Box sx={{ display: 'flex', background: '#FFF' }}>
			<Header
				appBarTitle={title}
				appBarSubtitle={subtitle}
				buttonInfo={buttonInfo}
				AddResource={AddResource}
				refreshResource={refreshResource}
				setConfirmation={setConfirmation}
			/>
			<DrawerContentContainer>
				<DrawerHeader />
				{/* <main
					className="content"
					style={{ height: '100%' }}
				>
					{children}
				</main> */}
				<Box
					sx={{
						height: `calc(100% - ${AppBarHeight})`,
						px: { xs: 2, md: 5 },
						zIndex: '4',
						position: 'relative'
						// padding: 1,
						// overflow: 'hidden',
					}}
				>
					{/* <Box
						sx={{
							background: '#FFF',
							height: '100%',
							border: '1px solid #E8EBE9',
							// border: '1.5px solid rgba(227, 239, 232, 1)',
							// border: '1.5px solid rgba(46, 199, 110, 0.15)',
							borderRadius: '18px',
							overflow: 'hidden',
						}}
					>
					</Box> */}
					{children}
				</Box>
			</DrawerContentContainer>
		</Box>
	);
};
