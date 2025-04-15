import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone_number: '',
    bio: '',
    address_line1: '',
    address_line2: '',
    postcode: '',
    state: '',
    area: '',
    email: '',
    country: '',
    region: '',
    profile_picture: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setFormData(prev => ({
          ...prev,
          ...response.data,
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) formDataToSend.append(key, value);
    });

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.put('http://127.0.0.1:8000/profile/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setEditing(false);
      setMessage('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found.</div>;

  const imageSrc =
  formData.profile_picture instanceof File
    ? URL.createObjectURL(formData.profile_picture)
    : formData.profile_picture ||
      profile.profile_picture ||
      'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';

  return (
    <div className="container">
      <div className="row">
        {/* Left Column */}
        <div className="left-column">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img className="rounded-circle" src={imageSrc} alt="profile" /><br />
            <span className="font-weight-bold mt-3">{profile.user.username}</span>
            {editing ? (
              <input type="text" name="bio" value={formData.bio} onChange={handleChange} className="form-control" />
            ) : (
              <p className="text-black/50">{formData.bio}</p>
            )}

            {editing && <input type="file" onChange={handleFileChange} className="mt-2" />}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Profile Settings</h4>
              
            </div>
            <div className="row mt-2">
              <div className="col-md-6">
                <label className="labels">First Name:  &nbsp;</label><br />
                <input type="text" name="name" value={profile.user.first_name} onChange={handleChange} className="form-control" disabled={!editing} />
              </div>
              <div className="col-md-6">
                <label className="labels">Surname:  &nbsp;</label><br />
                <input type="text" name="surname" value={profile.user.last_name} onChange={handleChange} className="form-control" disabled={!editing} />
              </div>
              <div className="col-md-6">
                <label className="labels">Middle Name:  &nbsp;</label><br />
                <input type="text" name="surname" value={profile.user.middle_name} onChange={handleChange} className="form-control" disabled={!editing} />
              </div>
            </div>

            <div className="row mt-3">
              {[
                ['phone_number', 'Mobile'],
                ['email', 'Email'],
                ['address_line1', 'Address 1'],
                ['address_line2', 'Address 2'],
                ['postcode', 'Postcode'],
                ['state', 'State'],
              ].map(([field, label]) => (
                <div className="col-md-12" key={field}>
                  <label className="labels">{label}: &nbsp;</label><br />
                  <input
                    type="text"
                    name={field}
                    value={profile.user[field]}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={label.toLowerCase()}
                    disabled={!editing}
                  />
                </div>
              ))}
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label className="labels">Country:  &nbsp;</label><br />
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" disabled={!editing} />
              </div>
              <div className="col-md-6">
                <label className="labels">Region: &nbsp;</label><br />
                <input type="text" name="region" value={formData.region} onChange={handleChange} className="form-control" disabled={!editing} />
              </div>
            </div>

            {editing && (
              <div className="mt-5 text-center">
                <button className="btn btn-primary profile-button" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}
            {message && (
              <div className="mt-3 text-center">
                <span className="text-success">{message}</span>
              </div>
            )}
          </div>
          <button className="edit_button" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .row {
          display: flex;
          gap: 5%;
          flex-wrap: wrap;
        }

        .left-column {
          width: 20%;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .left-column img {
          border-radius: 50%;
          width: 150px;
          margin-top: 20px;
        }

        .left-column .font-weight-bold {
          font-size: 18px;
          margin-top: 10px;
        }

        .left-column .text-black-50 {
          color: #6c757d;
        }

        .right-column {
          width: 70%;
          padding-left: 20px;
          padding-right: 20px;
        }

        .labels {
          font-size: 14px;
          margin-bottom: 5px;
        }

        input.form-control {
          margin-bottom: 10px;
          padding: 10px;
          justify-content: end;
          align-items: end;
        }

        .profile-button {
          background-color: rgb(99, 39, 120);
          border: none;
          color: white;
          padding: 10px 20px;
          cursor: pointer;
        }

        .profile-button:hover {
          background-color: #682773;
        }

        @media (max-width: 768px) {
          .row {
            flex-direction: column;
          }

          .left-column,
          .right-column {
            width: 100%;
            border: none;
            padding: 0;
          }

          .left-column {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewProfile;
