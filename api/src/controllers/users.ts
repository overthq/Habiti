import { Request, Response } from 'express';

import prismaClient from '../config/prisma';
import { hydrateQuery } from '../utils/queries';

const loadCurrentUser = async (req: Request) => {
	if (!req.auth) {
		throw new Error('User not authenticated');
	}

	const user = await prismaClient.user.findUnique({
		where: { id: req.auth.id }
	});

	if (!user) {
		throw new Error('User not found');
	}

	return user;
};

// GET /users/current
export const getCurrentUser = async (req: Request, res: Response) => {
	const user = await loadCurrentUser(req);
	return res.json({ user });
};

// PUT /users/current
export const updateCurrentUser = async (req: Request, res: Response) => {
	const { name, email } = req.body;

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const updatedUser = await prismaClient.user.update({
		where: { id: req.auth.id },
		data: { name, email }
	});

	return res.json({ user: updatedUser });
};

// DELETE /users/current
export const deleteCurrentUser = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	await prismaClient.user.delete({ where: { id: req.auth.id } });

	return res.status(204).json({ message: 'User deleted' });
};

// GET /users/current/followed-stores
export const getFollowedStores = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const followedStores = await prismaClient.storeFollower.findMany({
		where: { followerId: req.auth.id },
		include: { store: true }
	});

	return res.json({ followedStores });
};

// GET /users/current/orders
export const getOrders = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const orders = await prismaClient.order.findMany({
		where: { userId: req.auth.id },
		...query
	});

	return res.json({ orders });
};

// GET /users/current/carts
export const getCarts = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const carts = await prismaClient.cart.findMany({
		where: { userId: req.auth.id },
		include: { store: { include: { image: true } }, products: true }
	});

	return res.json({ carts });
};

// GET /users/current/cards
export const getCards = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const cards = await prismaClient.card.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ cards });
};

// GET /users/managed-stores
export const getManagedStores = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const stores = await prismaClient.storeManager.findMany({
		where: { managerId: req.auth.id },
		include: { store: true }
	});

	return res.json({ stores });
};

// GET /users/current/delivery-addresses
export const getDeliveryAddresses = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const addresses = await prismaClient.deliveryAddress.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ addresses });
};

// GET /users
export const getUsers = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const query = hydrateQuery(req.query);

	const users = await prismaClient.user.findMany({
		...query
	});

	return res.json({ users });
};

// GET /users/:id
export const getUser = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'User ID is required' });
	}

	const user = await prismaClient.user.findUnique({ where: { id } });
	return res.json({ user });
};

// GET /users/current/home
export const getUserHome = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const user = await loadCurrentUser(req);
	return res.json({ user });
};
