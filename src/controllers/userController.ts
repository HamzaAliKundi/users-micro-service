import { Request, Response } from 'express';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userController = {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get users list' });
    }
  },

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user.toObject();
      
      res.json({
        ...userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).json({ message: 'Email is already registered' });

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create user' });
    }
  }
};