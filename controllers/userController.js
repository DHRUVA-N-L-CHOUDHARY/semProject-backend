const User = require('../models/user');

// 1. Create User
exports.createUser = async (req, res) => {
  try {
    const { username, userId, phoneNumber, email, name, accountType, ownerDetails } = req.body;

    // Validate accountType
    if (!['Admin', 'Owner', 'Staff', 'User'].includes(accountType)) {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    const newUser = new User({
      username,
      userId,
      phoneNumber,
      email,
      name,
      accountType,
      ownerDetails: accountType === 'Staff' ? ownerDetails : null,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// 2. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// 3. Deactivate User (Admin/Owner)
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountType, requestingUser } = req.body;

    // Check permissions
    if (
      (requestingUser.accountType === 'Owner' && accountType !== 'Staff') ||
      (requestingUser.accountType === 'Admin' && !['Owner', 'Staff', 'User'].includes(accountType))
    ) {
      return res.status(403).json({ message: 'Unauthorized to deactivate this user' });
    }

    const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', error });
  }
};

// 4. Get All Users with Filters, Pagination, Sorting (Admin/Owner)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', filter } = req.query;
    const query = filter ? { accountType: filter } : {};

    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({ total, users, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// 5. Get/Edit/Delete Details for End User/Staff
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

exports.editUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details', error });
  }
};


exports.updateUserFields = async (req, res) => {
    try {
      const { id } = req.params; // User ID from route params
      const updates = req.body; // Fields to update (e.g., active: true)
  
      const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User fields updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user fields', error });
    }
  };