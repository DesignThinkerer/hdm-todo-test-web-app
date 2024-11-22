/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);

    const handleFetchTasks = async () => {
    const response = await api.get('/tasks');
    setTasks(response);
    setOriginalTasks(response);
  }

  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
  }

  const handleSave = async (task: Partial<Task>) => {
    // @done IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    try {
      if (task.id) {
        await api.patch(`/tasks/${task.id}`, { id: task.id, name: task.name });
      } else {
        await api.post('/tasks', { name: task.name });
      }
      await handleFetchTasks();
    } catch (error) {
      console.error('Failed to save the task:', error);
    }
  }

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks?.map((task) => (
            <Box display="flex" key={task.id} justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField
                size="small"
                value={task.name}
                fullWidth sx={{ maxWidth: 350 }}
                onChange={(e) => {
                  const updatedTasks = tasks.map(t =>
                    t.id === task.id ? { ...t, name: e.target.value } : t
                  );
                  setTasks(updatedTasks);
                }}
              />
              <Box>
                <IconButton
                  color="success"
                  onClick={() => handleSave(task)}
                  disabled={originalTasks.find(t => t.id === task.id)?.name === task.name}
                >
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => { }}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => handleSave({ name: "Nouvelle tâche" })}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
