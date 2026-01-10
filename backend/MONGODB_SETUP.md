# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Configure Database Access
1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
5. Set privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0) for development
   - For production, add only your server IP addresses
4. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your actual credentials

### Step 5: Update .env File
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/primetrade?retryWrites=true&w=majority
```

Replace:
- `yourusername` with your database username
- `yourpassword` with your database password
- `cluster0.xxxxx` with your actual cluster URL
- Keep `/primetrade` as the database name (or change it to your preferred name)

### Step 6: Restart Server
```bash
npm run dev
```

✅ Your app should now connect to MongoDB Atlas!

---

## Option 2: Local MongoDB Installation

### Windows

#### Method A: MongoDB Community Server (Recommended)
1. Download MongoDB Community Server:
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and install

2. During installation:
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. Start MongoDB Service:
   ```powershell
   # MongoDB should start automatically as a service
   # If not, start it manually:
   net start MongoDB
   ```

4. Verify MongoDB is running:
   ```powershell
   # Open a new terminal
   mongod --version
   # Or connect with MongoDB Compass to mongodb://localhost:27017
   ```

#### Method B: Using MongoDB via Docker (Alternative)
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop

2. Run MongoDB container:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. Verify it's running:
   ```bash
   docker ps
   ```

### macOS

#### Method A: Using Homebrew
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or run manually (non-service mode)
mongod --config /usr/local/etc/mongod.conf
```

#### Method B: Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
sudo systemctl status mongod
```

### After Local Installation

1. Update `.env` file (if needed):
   ```env
   MONGODB_URI=mongodb://localhost:27017/primetrade
   ```

2. Restart your server:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### Connection Refused Error
- **Windows**: Check if MongoDB service is running:
  ```powershell
  # Check service status
  Get-Service MongoDB
  
  # Start service if stopped
  net start MongoDB
  ```

- **macOS/Linux**: Check if MongoDB is running:
  ```bash
  # Check process
  ps aux | grep mongod
  
  # Check if port is in use
  lsof -i :27017
  ```

### Port Already in Use
- Another MongoDB instance might be running
- Change the port in MongoDB config or use a different port in connection string

### Authentication Failed
- Double-check username and password in connection string
- For Atlas, ensure IP address is whitelisted
- Verify database user has proper permissions

### Firewall Issues
- Ensure port 27017 is open (for local MongoDB)
- For Atlas, ensure your IP is whitelisted

---

## Quick Test

Once MongoDB is running, test the connection:

```bash
# If MongoDB is running locally, you can test with:
mongosh mongodb://localhost:27017/primetrade

# Or use MongoDB Compass GUI to connect
```

---

## Recommendation

For development and quick setup, **MongoDB Atlas** is recommended because:
- ✅ No local installation required
- ✅ Free tier available
- ✅ Works on any OS
- ✅ Automatic backups
- ✅ Easy to scale

For production, consider your specific requirements for choosing between cloud (Atlas) or self-hosted MongoDB.
