import { Typography } from '@mui/material';

export const PrivacyPolicy = () => {
	return (
		<>
			<Typography
				variant="h4"
				sx={{ fontWeight: 700, mb: 5 }}
			>
				Privacy policy
				<Typography
					variant="body2"
					sx={{ mt: 0.5 }}
				>
					<b style={{ fontWeight: 600 }}>Effective date:</b> 9th of May, 2024
				</Typography>
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mb: 1 }}
			>
				1. Introduction
			</Typography>

			<Typography variant="body1">
				Triage AI ("Triage AI", "we", "our", or "us") is committed to protecting the privacy of our
				users ("you" or "your"). This Privacy Policy describes how we collect, use, and disclose
				personal information when you use our services (the "Service").
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				2. Information We Collect
			</Typography>

			<Typography variant="body1">
				2.1. <u>Information You Provide:</u> We may collect personal information that you provide
				when you use our Service, such as your name, email address, username, and any other
				information you choose to provide.
				<br />
				<br />
				2.2. <u>Information We Collect Automatically:</u> We may automatically collect certain
				information when you use the Service, including your IP address, browser type, operating
				system, and usage data.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				3. Use of Information
			</Typography>

			<Typography variant="body1">
				We may use the information we collect for various purposes, including to provide, maintain,
				and improve the Service, to communicate with you, to customize your experience, and to
				comply with legal obligations.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				4. Sharing of information
			</Typography>

			<Typography variant="body1">
				We may share your personal information with third-party service providers who assist us in
				providing the Service, with your consent, or as required by law. We do not sell your
				personal information to third parties.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				5. Data Retention
			</Typography>

			<Typography variant="body1">
				We will retain your personal information for as long as necessary to fulfill the purposes
				outlined in this Privacy Policy unless a longer retention period is required or permitted by
				law.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				6. Your Choices
			</Typography>

			<Typography variant="body1">
				You may choose not to provide certain personal information, but this may limit your ability
				to use certain features of the Service. You may also choose to opt out of certain
				communications or request that we delete your personal information.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				7. Security
			</Typography>

			<Typography variant="body1">
				We take reasonable measures to protect the security of your personal information and prevent
				unauthorized access, use, or disclosure.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				8. International Transfer
			</Typography>

			<Typography variant="body1">
				Your personal information may be transferred to and processed in countries other than your
				own. By using the Service, you consent to the transfer of your information to such
				countries.
			</Typography>

			<Typography
				variant="body1"
				sx={{ fontWeight: 600, mt: 4, mb: 1 }}
			>
				9. Changes to this Privacy Policy
			</Typography>

			<Typography variant="body1">
				We may update this Privacy Policy from time to time. We will notify you of any changes by
				posting the new Privacy Policy on this page.{' '}
			</Typography>
		</>
	);
};
