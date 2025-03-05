import { Skeleton } from "@mui/material";

const DataMapper = ({
  data,
  Component,
  componentProps = () => ({}),
  getKey,
  loading,
  emptyStateComponent,
}) => {
  if (loading) {
    return (
      <>
        <div className="flex flex-col">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      </>
    );
  }

  if (!data || data.length === 0) {
    return emptyStateComponent;
  }
  return (
    <>
      {data.map((item) => (
        <Component key={getKey(item)} {...item} {...componentProps(item)} />
      ))}
    </>
  );
};

export default DataMapper;
