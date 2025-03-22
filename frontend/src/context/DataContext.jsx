import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAgentBackend } from '../hooks/useAgentBackend';
import { useDepartmentBackend } from '../hooks/useDepartmentBackend';
import { useEmailBackend } from '../hooks/useEmailBackend';
import { useFormBackend } from '../hooks/useFormBackend';
import { useGroupBackend } from '../hooks/useGroupBackend';
import { usePriorityBackend } from '../hooks/usePriorityBackend';
import { useQueueBackend } from '../hooks/useQueueBackend';
import { useRoleBackend } from '../hooks/useRoleBackend';
import { useScheduleBackend } from '../hooks/useScheduleBackend';
import { useSettingsBackend } from '../hooks/useSettingsBackend';
import { useSLABackend } from '../hooks/useSLABackend';
import { useStatusBackend } from '../hooks/useStatusBackend';
import { useTemplateBackend } from '../hooks/useTemplateBackend';
import { useTopicBackend } from '../hooks/useTopicBackend';
import { AuthContext } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

	DataProvider.propTypes = {
		children: PropTypes.node.isRequired
	}

	const { getAllAgents } = useAgentBackend();
	// const { getTicketsbyAdvancedSearch, getTicketByQueue } = useTicketBackend();
	const { getAllDepartments } = useDepartmentBackend();
	const { getAllRoles, getRoleById } = useRoleBackend();
	const { getAllSettings, getDefaultSettings } = useSettingsBackend();
	const { getAllSLAs } = useSLABackend();
	const { getAllPriorities } = usePriorityBackend();
	const { getAllGroups } = useGroupBackend();
	const { getAllStatuses } = useStatusBackend();
	const { getAllTopics } = useTopicBackend();
	const { getQueuesForAgent, getAllDefaultColumns } = useQueueBackend();
	const { getAllTemplates } = useTemplateBackend();
	const { getAllSchedules } = useScheduleBackend();
	const { getAllEmails } = useEmailBackend();
	const { getAllForms } = useFormBackend();
	const { preferences, permissions } = useContext(AuthContext)

	const [agents, setAgents] = useState([]);
	// const [tickets, setTickets] = useState([]);
	// const [totalTickets, setTotalTickets] = useState(0);

	const [departments, setDepartments] = useState([]);
	const [formattedDepartments, setFormattedDepartments] = useState([]);
	const [roles, setRoles] = useState([]);
	const [formattedRoles, setFormattedRoles] = useState([]);
	const [settings, setSettings] = useState({});

	const [slas, setSlas] = useState([]);
	const [formattedSLAs, setFormattedSLAs] = useState([]);

	const [priorities, setPriorities] = useState([]);
	const [formattedPriorities, setFormattedPriorities] = useState([]);

	const [groups, setGroups] = useState([]);
	const [formattedGroups, setFormattedGroups] = useState([]);

	const [statuses, setStatuses] = useState([]);
	const [formattedStatuses, setFormattedStatuses] = useState([]);

	const [topics, setTopics] = useState([]);
	const [formattedTopics, setFormattedTopics] = useState([]);

	const [queues, setQueues] = useState([])
	const [formattedQueues, setFormattedQueues] = useState([])

	const [templates, setTemplates] = useState([])
	const [formattedTemplates, setFormattedTemplates] = useState([])

	const [emails, setEmails] = useState([])
	const [formattedEmails, setFormattedEmails] = useState([])

	const [schedules, setSchedules] = useState([])
	const [formattedSchedules, setFormattedSchedules] = useState([])

	const [forms, setForms] = useState([])
	const [formattedForms, setFormattedForms] = useState([])

	const [defaultColumns, setDefaultColumns] = useState([])
	const [formattedDefaultColumns, setFormattedDefaultColumns] = useState([])

	const [defaultSettings, setDefaultSettings] = useState({})

	useEffect(() => {
		getDefaultSettings()
			.then((res) => {
				let obj = {}
				res.data.forEach((setting) => (obj[setting.key] = setting))
				setDefaultSettings(obj)
			})
			.catch(e => {
				console.error(e)
			})
	}, [])

	const refreshAgents = useCallback(() => {
		getAllAgents().then(agentList => {
			setAgents(agentList.data);
		});
	}, [getAllAgents]);

	// const refreshTicketSearch = useCallback(async (config, page, size) => {
	// 	await getTicketsbyAdvancedSearch(config, page, size).then(ticketList => {
	// 		const { items, total } = ticketList.data;
	// 		setTotalTickets(total)
	// 		setTickets(items);
	// 	}).catch((e) => console.error(e));
	// }, [getTicketsbyAdvancedSearch]);

	// const refreshTicketQueue = useCallback(async (queue_id, search, page, size) => {
	// 	await getTicketByQueue(queue_id, search, page, size).then(ticketList => {
	// 		const { items, total, queue_id } = ticketList.data;
	// 		setTotalTickets(total)
	// 		setTickets(items);
	// 		if (selectedQueueId !== queue_id) {
	// 			setSelectedQueueId(queue_id)
	// 		}
	// 	}).catch((e) => console.error(e));
	// }, [getTicketByQueue]);

	const refreshSettings = useCallback(() => {
		getAllSettings().then(settingsList => {
			let formattedSettings = {}
			Object.values(settingsList.data).forEach(setting => {
				formattedSettings[setting.key] = setting
			})
			setSettings(formattedSettings);
		});
	}, [getAllSettings]);

	const refreshDepartments = useCallback(() => {
		getAllDepartments()
			.then(depts => {
				const departmentsData = depts.data;
				const formattedDepts = departmentsData.map(dept => {
					return { value: dept.dept_id, label: dept.name };
				});
				setDepartments(departmentsData);
				setFormattedDepartments(formattedDepts);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllDepartments]);

	const refreshRoles = useCallback(() => {
		getAllRoles()
			.then(roles => {
				const rolesData = roles.data;
				const formattedRoles = rolesData.map(role => {
					return { value: role.role_id, label: role.name };
				});

				setRoles(rolesData);
				setFormattedRoles(formattedRoles);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllRoles]);

	const refreshSLAs = useCallback(() => {
		getAllSLAs()
			.then(slas => {
				const slasData = slas.data;
				const formattedSLAs = slasData.map(sla => {
					return { value: sla.sla_id, label: sla.name };
				});

				setSlas(slasData);
				setFormattedSLAs(formattedSLAs);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllSLAs]);

	const refreshPriorities = useCallback(() => {
		getAllPriorities()
			.then(priority => {
				const priorityData = priority.data;
				const formattedPriorities = priorityData.map(priority => {
					return { value: priority.priority_id, label: priority.priority_desc };
				});

				setPriorities(priorityData);
				setFormattedPriorities(formattedPriorities);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllPriorities]);

	const refreshGroups = useCallback(() => {
		getAllGroups()
			.then(group => {
				const groupData = group.data;
				const formattedGroups = groupData.map(group => {
					return { value: group.group_id, label: group.name };
				});

				setGroups(groupData);
				setFormattedGroups(formattedGroups);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllGroups]);

	const refreshStatuses = useCallback(() => {
		getAllStatuses()
			.then(status => {
				const statusData = status.data;
				const formattedStatuses = statusData.map(status => {
                    if (!permissions.hasOwnProperty('ticket.close') && status.state === 'closed') {
                        return null;
                    }
                    return { value: status.status_id, label: status.name };
                })
                .filter(Boolean); // Remove null values

				setStatuses(statusData);
				setFormattedStatuses(formattedStatuses);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllStatuses]);

	const refreshTopics = useCallback(() => {
		getAllTopics()
			.then(topic => {
				const topicData = topic.data;
				const formattedTopics = topicData.map(topic => {
					return { value: topic.topic_id, label: topic.topic };
				});

				setTopics(topicData);
				setFormattedTopics(formattedTopics);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllTopics]);

	const refreshQueues = useCallback(() => {
		getQueuesForAgent()
			.then(res => {
				res.data.map(entry => {
					entry.config = JSON.parse(entry.config)
				})
				const formattedQueues = res.data.map(queue => {
					return {
						value: queue.queue_id,
						label: queue.title
					};
				});
				setQueues(res.data)
				setFormattedQueues(formattedQueues)
			})
			.catch(err => {
				console.error(err);
			});
	}, [getQueuesForAgent]);

	const refreshTemplates = useCallback(() => {
		getAllTemplates()
			.then(templates => {
				const templatesData = templates.data;
				const formattedTemplates = templatesData.map(template => {
					return {
						value: template.template_name,
						label: template.template_name
					};
				});
				setTemplates(templatesData);
				setFormattedTemplates(formattedTemplates)
			})
			.catch(err => {
				console.error(err)
			});
	}, [getAllTemplates]);

	const refreshEmails = useCallback(() => {
		getAllEmails()
			.then(emails => {
				const emailsData = emails.data;
				const formattedEmails = emailsData.map(email => {
					return {
						value: email.email_id,
						label: email.email
					};
				});
				setEmails(emailsData);
				setFormattedEmails(formattedEmails)
			})
			.catch(err => {
				console.error(err)
			});
	}, [getAllEmails]);

	const refreshSchedules = useCallback(() => {
		getAllSchedules()
			.then(schedules => {
				const schedulesData = schedules.data;
				const formattedSchedules = schedulesData.map(schedule => {
					return {
						value: schedule.schedule_id,
						label: schedule.name,
						sublabel: schedule.description.charAt(0).toUpperCase() + schedule.description.slice(1),
					};
				});
				setSchedules(schedulesData)
				setFormattedSchedules(formattedSchedules);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllSchedules]);

	const refreshForms = useCallback(() => {
		getAllForms()
			.then(form => {
				const formData = form.data;
				const formattedForms = formData.map(form => {
					return { value: form.form_id, label: form.title };
				});

				setForms(formData);
				setFormattedForms(formattedForms);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllForms]);

	const refreshDefaultColumns = useCallback(() => {
		getAllDefaultColumns()
			.then(form => {
				const columnData = form.data;
				const formattedColumns = columnData.map(column => {
					return { value: form.default_column_id, label: form.name };
				});

				setDefaultColumns(columnData);
				setFormattedDefaultColumns(formattedColumns);
			})
			.catch(err => {
				console.error(err);
			});
	}, [getAllDefaultColumns]);

	const value = useMemo(() => (
		{
			agents,
			refreshAgents,
			// tickets,
			// refreshTicketSearch,
			// refreshTicketQueue,
			templates,
			formattedTemplates,
			refreshTemplates,
			emails,
			formattedEmails,
			refreshEmails,
			departments,
			formattedDepartments,
			refreshDepartments,
			roles,
			formattedRoles,
			refreshRoles,
			settings,
			refreshSettings,
			slas,
			formattedSLAs,
			refreshSLAs,
			refreshPriorities,
			priorities,
			formattedPriorities,
			refreshGroups,
			formattedGroups,
			groups,
			refreshStatuses,
			statuses,
			formattedStatuses,
			refreshTopics,
			topics,
			formattedTopics,
			queues,
			formattedQueues,
			refreshQueues,
			// totalTickets,
			refreshSchedules,
			schedules,
			formattedSchedules,
			forms,
			formattedForms,
			refreshForms,
			defaultColumns,
			formattedDefaultColumns,
			refreshDefaultColumns,
			defaultSettings
		}
	), [
		agents,
		refreshAgents,
		// tickets,
		// refreshTicketSearch,
		// refreshTicketQueue,
		templates,
		formattedTemplates,
		refreshTemplates,
		emails,
		formattedEmails,
		refreshEmails,
		departments,
		formattedDepartments,
		refreshDepartments,
		roles,
		formattedRoles,
		refreshRoles,
		settings,
		refreshSettings,
		slas,
		formattedSLAs,
		refreshSLAs,
		refreshPriorities,
		priorities,
		formattedPriorities,
		refreshGroups,
		formattedGroups,
		groups,
		refreshStatuses,
		statuses,
		formattedStatuses,
		refreshTopics,
		topics,
		formattedTopics,
		queues,
		formattedQueues,
		refreshQueues,
		// totalTickets,
		refreshSchedules,
		schedules,
		formattedSchedules,
		forms,
		formattedForms,
		refreshForms,
		defaultColumns,
		formattedDefaultColumns,
		refreshDefaultColumns,
		defaultSettings
	])

	return (
		<DataContext.Provider
			value={value}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
