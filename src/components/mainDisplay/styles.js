import { makeStyles } from '@mui/core/styles';

const styles = makeStyles({
  root: {
    display: 'flex',
  },
  example: props => ({
    zIndex: props.theme.zIndex.drawer + 1,
    transition: props.theme.transitions.create(['width', 'margin'], {
      easing: props.theme.transitions.easing.sharp,
      duration: props.theme.transitions.duration.leavingScreen,
    }),
  })
});

export default styles