# Oracle Cloud Infrastructure Server Setup

Oracle Cloud offers powerful servers at no cost to the user. Specifically, on the right locations, you can get a server that runs on up to 4 CPU cores and 24 GB of memory.

## Step 1: Create an Account
Navigate to [this page](https://www.oracle.com/cloud/free/) and click the "Start for Free" button. You will need to create an Oracle account if you don't already have one.

### IMPORTANT NOTE: when asked to select your home region, this is a decision you can't change. Whether specific regions have availability for A1 Flex instances is somewhat variable, but we at 5907 have had good luck with "Canada Southeast (Toronto)."
Note: If the region you select happens to not have A1 Flex instances available, that's okay. You can still create lower-tier VMs that, while slightly less powerful, should suffice.

Once you have created your account and are logged into Oracle Cloud, scroll down to the "Launch Resources" and choose "Create a VM Instance." Most of the settings can be left as default. Those that cannot be are listed below:

### Placement Section
- **Availability Domain**: Choose the first one available; If you run into an error later in the process because of lack of available instances, you can switch domains and try for a different one

### Security
This section can be left as is

### Image and Shape
- **Image**: You can use whichever linux version, or even Windows version, you are most comfortable with. Our servers use Ubuntu, so the commands throughout the rest of the guide will be in their ubuntu forms. They might need slight modifications for other distributions, but most of the time they are equivalent.
- **Image Name**: This can be any version of Linux, but 22.04 is the most recent with LTS (as of writing this document) so that's what this tutorial will use

- **Shape**: Choose the "A1 Flex" shape (in the Ampere section). This is the free tier of Oracle Cloud, and it is quite powerful for a free server. If you can't find this option, you may need to change your region to one that supports A1 Flex instances.
    - If you get through this process and can't use the "A1 Flex shape," select "Specialty and previous generation" to use the `VM.Standard.E2.1.Micro` shape.
### Primary VNIC Information
This should be able to be left as is, just ensure that the "Assign a public IPv4 address" box is checked 
### Add SSH keys
This section is important. Make sure to save both the public and private keys on your computer. This guide will come back to that later.
### Boot Volume
This can be left as is
### Block Volumes
This can be left as is

Once you have filled out all the necessary information, click "Create" at the bottom of the page. This will create your VM instance. Once it is created, you can click on the instance to see its details. You will need the public IP address to connect to the server, so make sure to note that down.

## Step 2: Connect to the Server
Once the server you created is out of the "PROVISIONING" state and in the "RUNNING" state, you are ready to start connecting to your VM.

This is a guide for our method of connecting to the server, which uses Putty. There are, of course, other options for connecting via SSH to the server, but this will be our method.

### Install PuTTY
Download PuTTY from [here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) and install it on your computer.

### Convert the private key to a .ppk file
PuTTY should have also installed PuTTYgen, the PuTTY key generator. Open PuTTYgen and click "Conversions" and "Import Key" to load the private key you saved earlier (that is the key file that does not have .pub). Once it is loaded, click "Save private key" and save it as a .ppk file. This is the file you will use to connect to your server.

### Connect to the server
Open PuTTY, and set the Public IP address of your server in the "Host Name" field. In the "Connection" section, expand the "SSH" section and click "Auth." In the "Private key file for authentication" field, click "Browse" and select the .ppk file you created earlier. In the "Connection" Section again, select "Data" and set the "Auto-login username" to `opc`

Back in the session tab, you can save this configuration by typing a name in the "Saved Sessions" field and clicking "Save." Then click "Open" to connect to your server. Accept the warnings as it tries to connect, and you should successfully connect to your server through SSH.