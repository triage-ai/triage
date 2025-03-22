Installation
============
After downloading the latest release of the frontend and backend, you will need to configure the environment files with the necessary variables to run the application.
The frontend will require a .env file in the root directory with the following variables:

.. code-block:: ini

 REACT_APP_BACKEND_URL=YOUR_BACKEND_URL
 GENERATE_SOURCE_MAP=false

And one for the backend in the root directory of that folder with the following variables:

.. code-block:: ini

 SQLALCHEMY_DATABASE_URL="YOUR_DATABASE_URL"
 SECRET_KEY="SECRET_KEY_HERE"
 SECURITY_PASSWORD_SALT="SECURITY_PASSWORD_SALT_HERE"
 FRONTEND_URL="YOUR_FRONTEND_URL"

Make sure the database url is the absolute path and not the relative path. For example a sqlite database would have a url like ***'sqlite:///triage_app/YOUR_DATABASE_NAME'***. A database will be created in the project directory if
no database already exists.

You can obtain the secret key and security password salt by running the following code in a Python file:

.. code-block:: python

    import secrets

    # Generate a 32-byte hexadecimal secret key
    secret_key = secrets.token_hex(32)

    # Generate a 32-byte hexadecimal password salt
    password_salt = secrets.token_hex(32)

You can print these values and copy them into the .env file.

Before running the backend, you will need to activate the virtual environment and install the necessary packages. You can do this by running the following commands in the root directory:

For Windows:

.. code-block:: bash

    .\env\Scripts\activate
    pip install -r requirements.txt

For MacOS/Linux:

.. code-block:: bash

    source env/bin/activate
    pip install -r requirements.txt


After completing the above steps, you can run the backend by running the following command in the root folder:

.. code-block:: bash

    uvicorn triage_app.main:app --host 0.0.0.0 --port YOUR_PORT_NUMBER > output.log 


Before running the frontend, you will need to install the necessary packages. You can do this by running the following commands in the root directory:

.. code-block:: bash

    npm install

After completing the above steps, you can run the frontend by running the following command in the root directory:

.. code-block:: bash

    npm run start


Ideally, you would serve the backend with a cloud service provider, VM, or Docker Container to avoid hardware limitations and provide high scalability, flexibility, and availability. 
Similarly, you would use some static hosting platform or cloud service provider to host the front end. Seeing as attachments are already stored in an S3 bucket, you can accomplish both of these tasks with AWS.
You can use another S3 bucket to deploy the build version of the frontend after running the **'npm run build'** command and use EC2 with CloudFront to serve the backend.