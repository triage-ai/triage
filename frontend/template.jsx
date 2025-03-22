const refresh& = useCallback(() => {
	getAll&()
		.then(? => {
			const ?Data = ?.data;
			const formatted& = ?Data.map(? => {
				return { value: ?.?_id, label: ?.name };
			});

			set&(?Data);
			setFormatted&(formatted&);
		})
		.catch(err => {
			console.error(err);
		});
}, [getAll&]);

const [#, set&] = useState([]);
const [formatted&, setFormatted&] = useState([]);