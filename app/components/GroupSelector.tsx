'use client';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";


export function GroupSelector({ groups, setSelectedGroup }: { groups: string[], setSelectedGroup: any }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Grupo Estudiantil"]));

  const selectedGroup = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    setSelectedGroup(selectedGroup);
  }, [selectedGroup, setSelectedGroup]);

  return (
    <Dropdown>
      <DropdownTrigger
        placeholder="Grupo Estudiantil"
      >
        <Button
          variant="bordered"
          className="capitalize"
          endContent={
            <Image src="/chevron-down.svg" width={24} height={24} alt=">" />
          }
        >
          {selectedGroup}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {groups.map((group) => (
          <DropdownItem key={group}>{group}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
