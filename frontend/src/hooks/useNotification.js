import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { Fragment, useEffect, useState } from 'react';

export const useNotification = () => {
	const [conf, setConf] = useState({});
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const action = key => (
		<Fragment>
			<IconButton
				sx={{ color: '#FFF' }}
				onClick={() => {
					closeSnackbar(key);
				}}
			>
				<X />
			</IconButton>
		</Fragment>
	);

	useEffect(() => {
		if (conf?.msg) {
			let variant = 'info';

			if (conf.variant) {
				variant = conf.variant;
			}

			enqueueSnackbar(conf.msg, {
				variant: variant,
				style: {
					fontSize: '1rem',
					fontWeight: 500,
				},
				autoHideDuration: conf?.autoHideDuration ? conf.autoHideDuration : 3500,
				anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
				action,
			});
		}
	}, [conf]);

	return setConf;
};
