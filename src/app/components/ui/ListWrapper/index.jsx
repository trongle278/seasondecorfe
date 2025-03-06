import Container from "../../layouts/Container";
import { BorderBox } from "../BorderBox";
import DropdownSelect from "../Select/DropdownSelect";

export const ListWrapper = ({ children, filters }) => {
  return (
    <Container>
      <div className="min-h-screen pt-5">
        <div className="flex container rounded-lg">
          <div className="flex-shrink-0 w-[250px]">
            <div className="flex">
              <ListSidebar filters={filters} />
            </div>
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export const ListSidebar = ({ filters }) => {
  return (
    <div className="flex flex-col flex-shrink-0 w-[180px] ">
      <div className="flex flex-col gap-10">
        {filters.map((filter, index) => (
          <div key={index} className="flex flex-1 flex-col justify-center pl-3">
            <DropdownSelect
              label={filter.label}
              options={filter.options}
              onChange={filter.onChange}
              lisboxClassName="mt-14"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
