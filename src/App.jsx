import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  // 1. Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890'
  });

  // 2. Dynamic Sections State
  const [dynamicSections, setDynamicSections] = useState([
    {
      id: 'skills-1',
      title: 'Professional Skills',
      value: 'JavaScript, React, Node.js, CSS, UI Design, Git'
    },
    {
      id: 'exp-2',
      title: 'Work History',
      value: 'Software Engineer at WebCorp\n- Built responsive web applications using React.\n- Collaborated with design teams to build reusable components.'
    },
    {
      id: 'proj-3',
      title: 'Key Projects',
      value: 'Portfolio Website\n- A clean, responsive portfolio to showcase developer work using Vite.'
    },
    {
      id: 'edu-4',
      title: 'Education',
      value: 'B.S. in Computer Science\nTech University (2018 - 2022)'
    }
  ]);

  // 3. Customization State
  const [activeTab, setActiveTab] = useState('content'); 
  const [layoutStructure, setLayoutStructure] = useState('headerLayout'); 
  const [profileImage, setProfileImage] = useState(null);
  const [themeColor, setThemeColor] = useState('#0f172a');
  const [fontColor, setFontColor] = useState('#334155');
  const [fontFamily, setFontFamily] = useState('sans-serif');

  const previewRef = useRef();

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (id, field, value) => {
    setDynamicSections((prevSections) =>
      prevSections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleAddNewSection = () => {
    const newSec = {
      id: Date.now().toString(),
      title: 'New Section Title',
      value: 'Enter your details here...'
    };
    setDynamicSections((prev) => [...prev, newSec]);
  };

  const handleDeleteSection = (id) => {
    setDynamicSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleDownloadPDF = () => {
    const element = previewRef.current;
    const opt = {
      margin:       0,
      filename:     `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="app-container">
      {/* LEFT SIDE: CONTROLS */}
      <div className="editor-panel">
        <div className="panel-header">
          <h2>Resume Engine</h2>
          <button className="download-btn" onClick={handleDownloadPDF}>Export PDF</button>
        </div>

        <div className="tab-row">
          <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Edit Content</button>
          <button className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`} onClick={() => setActiveTab('design')}>Design & Layout</button>
        </div>

        {/* TAB 1: CONTENT EDITING */}
        {activeTab === 'content' && (
          <div className="resume-form">
            <div className="form-section">
              <h3>Personal Info</h3>
              <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalChange} placeholder="Full Name" />
              <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalChange} placeholder="Email Address" />
              <input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalChange} placeholder="Phone Number" />
            </div>

            <div className="form-section">
              <h3>Resume Content Sections</h3>
              {dynamicSections.map((section) => (
                <div key={section.id} className="dynamic-section-card">
                  <div className="section-card-header">
                    <input 
                      type="text" 
                      className="section-title-input" 
                      value={section.title} 
                      onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      placeholder="Section Title"
                    />
                    <button className="delete-section-btn" onClick={() => handleDeleteSection(section.id)}>✕</button>
                  </div>
                  <textarea 
                    value={section.value} 
                    onChange={(e) => handleSectionChange(section.id, 'value', e.target.value)}
                    placeholder="Section content..."
                  />
                </div>
              ))}
              <button type="button" className="add-section-btn" onClick={handleAddNewSection}>
                + Add Custom Section
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN CUSTOMIZATION */}
        {activeTab === 'design' && (
          <div className="form-section">
            <h3>Structural Setup</h3>
            <div className="control-group mb-20">
              <label>Resume Template Layout</label>
              <select value={layoutStructure} onChange={(e) => setLayoutStructure(e.target.value)}>
                <option value="headerLayout">Classic Top-Header Block</option>
                <option value="sidebarLayout">Modern Split Sidebar</option>
              </select>
            </div>

            <h3>Styling Palette</h3>
            <div className="customizer-grid">
              <div className="control-group">
                <label>Theme Base Color</label>
                <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
              </div>
              <div className="control-group">
                <label>Body Copy Color</label>
                <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
              </div>
              <div className="control-group">
                <label>Font Family</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                  {/* --- 20 DIVERSE STANDARD SYSTEM FONTS --- */}
                  <optgroup label="Modern Sans-Serif">
                    <option value="system-ui, sans-serif">Default System</option>
                    <option value="'Inter', sans-serif">Inter UI</option>
                    <option value="'Segoe UI', Tahoma, sans-serif">Segoe UI</option>
                    <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica Modern</option>
                    <option value="Arial, Helvetica, sans-serif">Arial Work</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                    <option value="'Gill Sans', sans-serif">Gill Sans</option>
                    <option value="Impact, sans-serif">Impact Corporate</option>
                  </optgroup>
                  <optgroup label="Elegant Serif">
                    <option value="Georgia, serif">Georgia Editorial</option>
                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                    <option value="'Palatino Linotype', Palatino, serif">Palatino Elegant</option>
                    <option value="Baskerville, serif">Baskerville Traditional</option>
                    <option value="Garand, serif">Garamond Book</option>
                    <option value="'Cambria', serif">Cambria Academic</option>
                  </optgroup>
                  <optgroup label="Clean Monospace & Display">
                    <option value="monospace">Standard Mono</option>
                    <option value="'Courier New', Courier, monospace">Courier Classical</option>
                    <option value="'Lucida Sans Typewriter', Monaco, monospace">Lucida Typewriter</option>
                    <option value="Consolas, monospace">Consolas Tech</option>
                    <option value="Comic Sans MS, cursive">Creative Display</option>
                    <option value="Copperplate, serif">Copperplate Bold</option>
                  </optgroup>
                </select>
              </div>
              <div className="control-group">
                <label>Avatar Photo</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: LIVE DYNAMIC PREVIEW */}
      <div className="preview-panel">
        <div 
          ref={previewRef} 
          className={`resume-paper ${layoutStructure}`}
          style={{ fontFamily: fontFamily, color: fontColor }}
        >
          {layoutStructure === 'headerLayout' && (
            <>
              <header className="resume-header" style={{ backgroundColor: themeColor }}>
                {profileImage && (
                  <div className="profile-img-container">
                    <img src={profileImage} alt="Profile" className="profile-img" />
                  </div>
                )}
                <div className="header-text">
                  <h1>{personalInfo.name || 'Your Name'}</h1>
                  <p>{personalInfo.email} | {personalInfo.phone}</p>
                </div>
              </header>
              <div className="resume-body">
                {dynamicSections.map((sec) => (
                  <section key={sec.id} className="resume-section">
                    <h4 style={{ color: themeColor, borderBottomColor: themeColor }}>{sec.title}</h4>
                    <p>{sec.value}</p>
                  </section>
                ))}
              </div>
            </>
          )}

          {layoutStructure === 'sidebarLayout' && (
            <div className="split-layout-wrapper">
              <aside className="resume-sidebar-panel" style={{ backgroundColor: themeColor }}>
                {profileImage && (
                  <div className="profile-img-container center-avatar">
                    <img src={profileImage} alt="Profile" className="profile-img" />
                  </div>
                )}
                <h1 className="sidebar-name">{personalInfo.name}</h1>
                <div className="sidebar-contact">
                  <p>{personalInfo.email}</p>
                  <p>{personalInfo.phone}</p>
                </div>
              </aside>
              <main className="resume-main-panel">
                {dynamicSections.map((sec) => (
                  <section key={sec.id} className="resume-section">
                    <h4 style={{ color: themeColor, borderBottomColor: themeColor }}>{sec.title}</h4>
                    <p>{sec.value}</p>
                  </section>
                ))}
              </main>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;