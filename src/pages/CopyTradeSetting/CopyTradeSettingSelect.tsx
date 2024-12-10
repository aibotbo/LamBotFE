import React, { FC, useState } from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FormikProps } from 'formik';
import { ICopyTradeSettingFormik } from './CopyTradeSettingFollow';

interface CopyTradeSettingSelectProps {
  value: string;
  label: string;
  name: string;
  labelId?: string;
  id: string;
  formik: FormikProps<ICopyTradeSettingFormik>;
}

const BoostrapSelectInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'var(--color-ink-05)',
    border: '1px solid var(--color-ink-05)',
    padding: '1rem',
    color: 'var(--color-ink-100)',
  },
}));

const CopyTradeSettingSelect: FC<CopyTradeSettingSelectProps> = ({
  value,
  name,
  label,
  labelId,
  id,
  formik,
}) => {
  const [selectSearch, setSelectSearch] = useState('');

  const handleSelectSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSelectSearch(e.target.value);
  };

  return (
    <FormControl variant="standard">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        name={name}
        value={value}
        label={label}
        onChange={(e) => {
          formik.setFieldValue(name, e.target.value);
        }}
        variant="filled"
        input={<BoostrapSelectInput />}
        sx={{}}
      >
        <TextField
          sx={{
            border: 0,
          }}
          fullWidth
          id="selectSearch"
          name="selectSearch"
          value={selectSearch}
          onChange={handleSelectSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CopyTradeSettingSelect;
