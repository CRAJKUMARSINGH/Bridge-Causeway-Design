# 🚧 CAUSEWAY DESIGN PRO - HOW TO RUN

## 📋 **Prerequisites**

Before running the application, ensure you have:

- **Windows 10/11** (64-bit recommended)
- **Node.js 18.0.0 or higher** - [Download Here](https://nodejs.org/)
- **Internet connection** (for first-time dependency installation)

## 🚀 **Easy Startup (Recommended)**

### **Option 1: Double-Click Method (Easiest)**

1. **Double-click** `START_APP.bat`
2. **Wait** for the app to start
3. **Browser opens automatically** to `http://localhost:3000`
4. **Keep the command window open** while using the app

### **Option 2: Manual Installation First**

If you're running for the first time:

1. **Double-click** `INSTALL_DEPS.bat`
2. **Wait** for installation to complete
3. **Double-click** `START_APP.bat`
4. **Enjoy the app!**

## 🔧 **Manual Installation (Advanced Users)**

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Start the Application**
```bash
npm start
```

### **Step 3: Open Browser**
Navigate to: `http://localhost:3000`

## 📱 **Using the Application**

### **Main Features:**
- **Design Tab**: Input causeway parameters and calculate design
- **Drawing Tab**: Create 2D drawings of your causeway
- **3D View**: Visualize your design in 3D
- **Analysis Tab**: View detailed calculations and charts
- **PDF Reports**: Generate professional design documentation

### **Quick Start:**
1. **Enter dimensions**: Length, Width, Height, Water Depth
2. **Select soil type** and load conditions
3. **Click "Calculate Design"**
4. **View results** and generate PDF reports
5. **Create drawings** and 3D visualizations

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **"Node.js not found" Error**
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **Restart** your computer after installation

#### **"Port 3000 already in use" Error**
- **Solution**: Close other applications using port 3000
- **Alternative**: The app will automatically find an available port

#### **"Dependencies failed to install" Error**
- **Solution**: Run `INSTALL_DEPS.bat` as Administrator
- **Alternative**: Clear npm cache: `npm cache clean --force`

#### **"Cannot connect to server" Error**
- **Solution**: Ensure firewall allows Node.js
- **Check**: Antivirus isn't blocking the application

### **Performance Issues:**
- **Close unnecessary browser tabs**
- **Restart the application** if it becomes slow
- **Clear browser cache** if drawings don't load

## 📁 **File Structure**

```
Causeway/
├── START_APP.bat          ← Double-click to start
├── INSTALL_DEPS.bat       ← First-time setup
├── HOW_TO_RUN.md          ← This file
├── README.md              ← Technical documentation
├── server.js              ← Main application server
├── public/                ← Frontend files
└── ATTACHED_ASSETS/       ← Excel templates & data
```

## 🔄 **Updates & Maintenance**

### **Updating Dependencies:**
```bash
npm update
```

### **Clean Installation:**
1. Delete `node_modules` folder
2. Run `INSTALL_DEPS.bat`

### **Backup Your Data:**
- **Excel files** in `ATTACHED_ASSETS/`
- **Generated PDFs** (download and save)
- **Custom drawings** (export and save)

## 📞 **Support**

### **For Technical Issues:**
- Check this `HOW_TO_RUN.md` file
- Review `README.md` for technical details
- Ensure all prerequisites are met

### **For Application Features:**
- Use the built-in help system
- Refer to the user interface tooltips
- Check the analysis tab for detailed explanations

## 🎯 **Quick Reference**

| Action | File to Run | When to Use |
|--------|-------------|-------------|
| **Start App** | `START_APP.bat` | Every time you want to use the app |
| **First Time Setup** | `INSTALL_DEPS.bat` | Only once, after installing Node.js |
| **Manual Start** | `npm start` | Advanced users, command line |

## ✨ **Tips for Best Experience**

1. **Keep the command window open** while using the app
2. **Use the batch files** instead of manual commands
3. **Save your work** by generating PDF reports
4. **Export drawings** for sharing with team members
5. **Bookmark** `http://localhost:3000` in your browser

---

**🎉 Happy Designing! Your Causeway Design Pro app is ready to create amazing engineering solutions!**
