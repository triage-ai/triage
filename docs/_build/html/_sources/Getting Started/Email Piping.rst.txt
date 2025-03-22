Email Piping
============

There are a variety of ways customers can interact with a support system. triage.ai supports email piping to convert incoming emails into tickets so agents do not need to 
access the support platform and check their email for incoming support requests. This feature is automatically enabled if a registered email enables :doc:`IMAP Polling <IMAP Settings>`.

Every email with IMAP polling enabled will check the email's inbox for any new emails and convert them to tickets. These tickets will be assigned to the default help topic and priority, which can be picked in the settings tab available to admins.
These tickets will be marked as originating from emails so that any replies the agent makes within the ticket's thread will be sent back as an email reply to the customer's email address.
The IMAP polling task will also check if any new emails are replies in an email conversation belonging to an existing ticket and append the email's contents to the ticket's thread.

Attachments on both ends will be handled appropriately if the attachment plugin is set up according to the :doc:`Attachments Guide <../Plugins/Attachments with S3>`.