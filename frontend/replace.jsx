const refreshTopics = useCallback(() => {
	getAllTopics()
		.then(topic => {
			const topicData = topic.data;
			const formattedTopics = topicData.map(topic => {
				return { value: topic.topic_id, label: topic.name };
			});

			setTopics(topicData);
			setFormattedTopics(formattedTopics);
		})
		.catch(err => {
			console.error(err);
		});
}, [getAllTopics]);

const [topics, setTopics] = useState([]);
const [formattedTopics, setFormattedTopics] = useState([]);