import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    bio: '',
    profile_picture: null,
  });

  useEffect(() => {
    axios.get('/api/profile/')
      .then(response => {
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          phone_number: response.data.phone_number || '',
          bio: response.data.bio || '',
          profile_picture: null,  
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });
  }, []);

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profile_picture: file }));
  };

  const handleSave = () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('bio', formData.bio);
    if (formData.profile_picture) {
      formDataToSend.append('profile_picture', formData.profile_picture);
    }

    axios.put('/api/profile/', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setProfile(response.data);
        setEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Failed to load profile</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col items-center">
        {editing ? (
          <>
            {formData.profile_picture && (
              <img
                src={URL.createObjectURL(formData.profile_picture)}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}
            {!formData.profile_picture && profile.profile_picture && (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="Name"
            />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="Phone Number"
            />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border p-2 w-full mb-2"
              placeholder="Bio"
            />
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="text-sm text-gray-500 mt-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phone_number}</p>
            {profile.bio && <p className="mt-4 text-gray-700">{profile.bio}</p>}
            {profile.profile_picture && (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}
            <button
              onClick={handleEditToggle}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
