import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

    constructor() { }

    public getTodos = async (req: Request, res: Response) => {

        const todos = await prisma.todo.findMany();

        return res.json({ ok: true, todos });
    }

    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ ok: false, message: 'Invalid id' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        return todo
            ? res.json({ ok: true, todo })
            : res.status(404).json({ ok: false, message: 'Todo not found' });
    }

    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ ok: false, message: error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json(todo);
    }

    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ ok: false, message: error });

        const todo = await prisma.todo.findFirst({
            where: { id },
        });

        if (!todo) return res.status(404).json({ ok: false, message: `Todo with id ${id} not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        return res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ ok: false, message: 'Invalid id' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if (!todo) return res.status(404).json({ ok: false, message: `Todo with id ${id} not found` });

        const deletedTodo = await prisma.todo.delete({
            where: { id }
        });

        return res.json({ todo, deletedTodo });
    }
}