import { Avatar, Box, Button, Container, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Modal, TextField, Snackbar, Alert } from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import './App.css';
import useAPI from "./hooks/useAPI";
import { useEffect, useState } from "react";
import Material from "./schemas/stock";
import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { NumericFormat, NumericFormatProps } from "react-number-format";
import React from "react";
import { useForm } from "react-hook-form";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
      const { onChange, ...other } = props;

      return (
        <NumericFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            onChange({
              target: {
                name: props.name,
                value: values.value,
              },
            });
          }}
          thousandSeparator="."
          decimalSeparator=","
          valueIsNumericString
          prefix="R$"
        />
      )
    }
);

function App() {
  const [allMaterials, setAllMaterials] = useState(new Array<Material>(0));
  const [openModal, setOpenModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Material | undefined>(undefined)
  const { getAllMaterials, updateMaterial, createMaterial, deleteMaterial } = useAPI();
  

  const { register, getValues } = useForm()

  useEffect(() => {
    getAllMaterials().then((materials) => {
      setAllMaterials(materials);
    });
  }, [allMaterials.length === 0]);


  const onSubmit = () => {
    const data = getValues();
    const payload: Material = {
      id: productToUpdate ? productToUpdate.id : null,
      name: data.name,
      description: data.description,
      observation: data.observation || '',
      quantity: parseInt(data.quantity),
      price: parseFloat(data.price.split('$')[1].replace(',', '.')),
      last_replacement: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    if (productToUpdate?.id){
      updateMaterial(productToUpdate.id, payload).then((material) => {
        if (material) {
          setOpenToast(true);
          setAllMaterials([...allMaterials.filter((m) => m.id !== material.id), material]);
        }
        setOpenModal(false);
      })
      
    }
    else{
      createMaterial(payload).then((material) => {
        if (material) {
          setOpenToast(true);
          setAllMaterials([...allMaterials, material]);
        }
        setOpenModal(false);
      });
    }
  }

  const handleRemove = (id: number | null) => {
    if (id) {
      deleteMaterial(id).then((success) => {
        if (success) {
          setOpenToast(true);
          setAllMaterials(allMaterials.filter((material) => material.id !== id))
        }
      });
    }
  }

  return (
    <>
    <Container>
      <div className="row">
        <h2>App Stock</h2>
        <StorefrontIcon className="icon" color="success" />
      </div>
      <div className="backgroundList">
        <Grid 
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Button variant="contained" color="success" startIcon={<AddCircleIcon />} onClick={() => setOpenModal(true)}>Adicionar</Button>
        </Grid>
        <List sx={{ width: '100%', minWidth: 800 }}>
          {
            allMaterials.map((material) => (
              <ListItem 
                key={material.id}
                secondaryAction={
                  <div>
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => {
                        setProductToUpdate(material);
                        setOpenModal(true);
                        }}>
                      <EditIcon color="secondary"/>
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(material.id)}>
                      <DeleteOutlineIcon color="secondary"/>
                    </IconButton>
                  </div>
                }>
                <ListItemAvatar>
                  <Avatar>
                    <BlockIcon color="secondary"/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText key={material.id} secondary={material.description}>
                  <Grid 
                    container 
                    columnSpacing={2}
                    justifyContent="flex-start"
                    alignItems="center">
                    <Grid 
                      item 
                      xs={4}
                      justifyContent="center"
                      alignItems="flex-end"
                      >
                      {material.name}
                    </Grid>
                    <Grid item xs>
                      <Grid container direction='column'>
                        <Grid>
                          Quantidade
                        </Grid>
                        <Grid>
                          {material.quantity}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Grid container direction='column'>
                        <Grid>
                          Preço (R$)
                        </Grid>
                        <Grid>
                          {material.price}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Grid container direction='column'>
                        <Grid>
                          Última reposição
                        </Grid>
                        <Grid>
                          {material.last_replacement} 
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            ))
          }
        </List>
      </div>
    </Container>
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}>
          <Box className="modalContainer">
            <Grid container direction='column'>
              <Grid item className="gridItemPadding">
                <Grid 
                  container
                  columnSpacing={2}
                  justifyContent="flex-start"
                  alignItems="center">
                  <Grid item >
                    <TextField 
                      label="Nome do produto" 
                      size="small" 
                      variant="standard" 
                      defaultValue={productToUpdate ? productToUpdate.name : ''}
                      {...register('name')}/>
                  </Grid>
                  <Grid item >
                    <TextField 
                      label="Descrição do produto" 
                      size="small" 
                      variant="standard" 
                      defaultValue={productToUpdate ? productToUpdate.description : ''}
                      {...register('description')}
                      multiline
                      style={{ minWidth: '400px' }}
                      maxRows={4}/>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="gridItemPadding">
                <Grid 
                  container
                  columnSpacing={2}
                  justifyContent="flex-start"
                  alignItems="center">
                  <Grid item >
                    <TextField 
                      label="Observações" 
                      size="small" 
                      variant="standard" 
                      defaultValue={productToUpdate ? productToUpdate.observation : ''}
                      {...register('observation')}
                      multiline
                      style={{ minWidth: '400px' }}
                      maxRows={4}/>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                columnSpacing={2}
                justifyContent="flex-start"
                alignItems="center">
                  <Grid item className="gridItemPadding">
                    <TextField
                      label="Preço do produto"
                      defaultValue={productToUpdate ? productToUpdate.price : ''}
                      {...register('price')}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                      variant="standard"/>
                  </Grid>
                  <Grid item className="gridItemPadding">
                    <TextField 
                      type="number" 
                      label="Quantidade do produto" 
                      size="small" 
                      variant="standard" 
                      defaultValue={productToUpdate ? productToUpdate.quantity : ''}
                      {...register('quantity')}/>
                  </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              columnSpacing={2}
              justifyContent="flex-end"
              alignItems="center">
              <Button variant="contained" type="submit" color="success" onClick={() => onSubmit()}>Confirmar</Button>
            </Grid>
          </Box>
    </Modal>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={openToast}
      onClose={() => setOpenToast(false)}
      key={'top' + 'center'}
      autoHideDuration={4000}
    >
      <Alert onClose={() => setOpenToast(false)} severity="success" sx={{ width: '100%' }}>
        Realizado com sucesso!
      </Alert>
    </Snackbar>
    </>
  )
};

export default App
