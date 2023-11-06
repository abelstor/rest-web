import { Request, Response } from 'express';
import { TodoRepository } from '../../domain';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    public getTodos = async (req: Request, res: Response) => {

        const todos = await this.todoRepository.getAll();
        return res.json({ ok: true, todos });
    }

    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id;
        try {
            const todo = await this.todoRepository.findById(id);
            return res.json({ ok: true, todo });

        } catch (error) {
            return res.status(404).json({ ok: false, message: error });
        }
    }

    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ ok: false, message: error });
        const todo = await this.todoRepository.create(createTodoDto!);
        return res.json({ ok: true, todo });
    }

    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ ok: false, message: error });
        const todo = await this.todoRepository.updateById(updateTodoDto!);
        return res.json({ ok: true, todo });
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;
        const todo = await this.todoRepository.deleteById(id);
        return res.json({ ok: true, todo });
    }

}