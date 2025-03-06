import { Button, Input } from "antd";
import { useState } from "react";
import { TopSearchProps } from "../interfaces/TopSearchInterface";
import { TopSearchStyle } from "./style";

const { Search } = Input;
const TopSearch = ({ search, action }: TopSearchProps) => {
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchString: string) => {
    setLoading(true);
    if (search) {
      await search.onClick(searchString as string);
    }
    setLoading(false);
  };
  return (
    <TopSearchStyle>
      <div className="top-search-container">
        <div className="top-search-container__search">
          {search && (
            <Search
            style={{position:'relative'}}
              placeholder={search.placeholder}
              onSearch={handleSearch}
              loading={loading}
              enterButton
            />
          )}
        </div>

        <div className="top-search-container__button">
          {action && (
            <Button
              type="primary"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon}
              {action.buttonText}
            </Button>
          )}
        </div>
      </div>
    </TopSearchStyle>
  );
};

export default TopSearch;
