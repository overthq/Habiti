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

export const getCurrentUser = async (req: Request, res: Response) => {
	const user = await loadCurrentUser(req);
	return res.json({ user });
};

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

export const deleteCurrentUser = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	await prismaClient.user.delete({ where: { id: req.auth.id } });

	return res.status(204).json({ message: 'User deleted' });
};

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

export const getCards = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const cards = await prismaClient.card.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ cards });
};

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

export const getDeliveryAddresses = async (req: Request, res: Response) => {
	if (!req.auth) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const addresses = await prismaClient.deliveryAddress.findMany({
		where: { userId: req.auth.id }
	});

	return res.json({ addresses });
};

export const getUsers = async (req: Request, res: Response) => {
	const query = hydrateQuery(req.query);

	const users = await prismaClient.user.findMany({
		...query
	});

	return res.json({ users });
};

export const getUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'User ID is required' });
	}

	const user = await prismaClient.user.findUnique({ where: { id } });
	return res.json({ user });
};
