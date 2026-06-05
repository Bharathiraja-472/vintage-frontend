import React, { useContext, useState, useEffect } from 'react';
import { User, MapPin, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);

  // Profile fields states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address form states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const payload = { name, email, phone };
    if (password) {
      payload.password = password;
    }

    try {
      await updateProfile(payload);
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err || 'Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      setErrorMsg('Please fill in all address fields.');
      return;
    }

    try {
      const updatedAddresses = [...(user.addresses || []), newAddress];
      await updateProfile({ addresses: updatedAddresses });
      
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      });
      setShowAddressForm(false);
      setMessage('Address added successfully!');
    } catch (err) {
      setErrorMsg(err || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setMessage('');
    setErrorMsg('');

    try {
      const updatedAddresses = user.addresses.filter((addr) => addr._id !== addrId);
      await updateProfile({ addresses: updatedAddresses });
      setMessage('Address deleted successfully!');
    } catch (err) {
      setErrorMsg(err || 'Failed to delete address');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">My Profile</h1>
        <div className="h-0.5 w-12 bg-gold mt-1"></div>
      </div>

      {message && (
        <div className="flex items-center space-x-2 text-xs text-green-700 bg-green-50 border border-green-200 p-3 rounded">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile & Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Account credentials form */}
        <div className="lg:col-span-2 bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-charcoal border-b pb-3 mb-4 flex items-center gap-2">
            <User size={18} className="text-gold" />
            <span>Account Details</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  placeholder="10 digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">New Password (optional)</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 border rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-charcoal hover:bg-gold text-white hover:text-charcoal px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                {loading ? 'Saving...' : 'Update Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Shipping Address Book */}
        <div className="space-y-6">
          <div className="bg-white border border-luxuryGray-dark/20 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-2">
              <h3 className="text-base font-serif font-bold text-charcoal flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                <span>Address Book</span>
              </h3>
              
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-gold hover:text-gold-dark transition-colors flex items-center gap-0.5 text-xs font-semibold"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* List addresses */}
            {user?.addresses?.length === 0 ? (
              <p className="text-xs text-gray-400 font-sans text-center py-6 border border-dashed rounded">
                No shipping addresses saved yet.
              </p>
            ) : (
              <div className="space-y-3">
                {user?.addresses?.map((addr) => (
                  <div key={addr._id} className="border border-luxuryGray p-3.5 rounded-lg flex justify-between items-start text-xs text-gray-600 bg-beige-light/20 relative">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-charcoal">{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p>{addr.country}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2 self-start"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Form overlay/inline */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 text-xs bg-beige-light p-4 rounded border border-gold/15 animate-fadeIn">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal mb-1">New Address</h4>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full p-2 border bg-white rounded focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full p-2 border bg-white rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full p-2 border bg-white rounded focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Pin Code"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full p-2 border bg-white rounded focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      disabled
                      value={newAddress.country}
                      className="w-full p-2 border bg-gray-50 text-gray-500 rounded cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="w-1/2 border py-2 uppercase text-gray-400 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-charcoal text-white hover:bg-gold hover:text-charcoal py-2 uppercase rounded transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
