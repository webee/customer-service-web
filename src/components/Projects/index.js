import styles from './index.css';


export default ({match}) => {
  const {params} = match;
  return (
    <h1>Projects of: {params.projectDomain}/{params.projectType}</h1>
  );
};
