import { TestBed } from '@angular/core/testing';
import { NgVirtualTableService } from './ngVirtualTable.service';
import { sortColumn, VirtualTableColumn } from '../interfaces';
import { Input } from '@angular/core';

export class InfoComponent {
  @Input() name: string;

  constructor() {}
}

describe('NgVirtualTableService', () => {
  let service: NgVirtualTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgVirtualTableService],
    });
    service = TestBed.get(NgVirtualTableService);
  });

  it('Should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('defaultComparator', () => {
    it('should return 0', () => {
      const answer = service.defaultComparator(4, 4);
      expect(answer).toBe(0);
      const answer1 = service.defaultComparator(-4, -4);
      expect(answer1).toBe(0);
      const answer2 = service.defaultComparator('aaa', 'aaa');
      expect(answer).toBe(0);
    });

    it('should return 1', () => {
      const answer = service.defaultComparator(4, 3);
      expect(answer).toBe(1);
      const answer1 = service.defaultComparator(-4, -5);
      expect(answer1).toBe(1);
      const answer2 = service.defaultComparator('aaa', 'bbb');
      expect(answer).toBe(1);
    });

    it('should return -1', () => {
      const answer = service.defaultComparator(3, 4);
      expect(answer).toBe(-1);
      const answer1 = service.defaultComparator(-5, -4);
      expect(answer1).toBe(-1);
      const answer2 = service.defaultComparator('bbbb', 'aaa');
      expect(answer).toBe(-1);
    });
  });

  describe('getElement', () => {
    it('should return key of element', () => {
      const item = {
        name: 5,
      };

      expect(service.getElement(item, (e: any) => e.name)).toBe(5);

      const item2 = {
        name: 5,
        label: {
          test: {
            test: {
              test: 'name',
            },
          },
        },
      };

      expect(service.getElement(item, (e: any) => e.name)).toBe(5);
      expect(service.getElement(item2, (e: any) => e.label.test.test.test)).toBe('name');
    });
  });

  describe('createColumnFromConfigColumn', () => {
    it('should create item from string', () => {
      let createMock = {
        name: 'key',
        key: 'key',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: true,
        component: false,
        draggable: true,
      };

      expect(service.createColumnFromConfigColumn('key')).toEqual(createMock);
    });

    it('should use `func` for get data', () => {
      function getData(item: any) {
        return item;
      }
      let mock2 = {
        name: 'Full Name',
        key: 'age2',
        func: getData,
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: false,
        component: {
          componentConstructor: InfoComponent,
          inputs: {
            name: expect.any(Function),
          },
        },
        draggable: true,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          name: 'Full Name',
          resizable: false,
          func: getData,
          comp: service.defaultComparator,
          component: {
            componentConstructor: InfoComponent,
            inputs: {
              name: (e: any) => e.name,
            },
          },
        }),
      ).toEqual(mock2);
    });

    it('should create default for `func`', () => {
      let mock2 = {
        name: 'Full Name',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: false,
        component: {
          componentConstructor: InfoComponent,
          inputs: {
            name: expect.any(Function),
          },
        },
        draggable: true,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          name: 'Full Name',
          resizable: false,
          func: null,
          comp: expect.any(Function),
          component: {
            componentConstructor: InfoComponent,
            inputs: {
              name: (e: any) => e.name,
            },
          },
        }),
      ).toEqual(mock2);
    });

    it('should throw error', () => {
      try {
        service.createColumnFromConfigColumn({
          name: 'Full name',
          sort: false,
        } as any);
      } catch (e) {
        expect(e.message).toBe('Column key is required');
      }
    });

    it('should create item from object', () => {
      let mock = {
        name: 'Full name',
        key: 'name',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: false,
        resizable: true,
        component: false,
        draggable: true,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'name',
          name: 'Full name',
          sort: false,
        }),
      ).toEqual(mock);

      let mock2 = {
        name: 'Full Name',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: false,
        component: {
          componentConstructor: InfoComponent,
          inputs: {
            name: expect.any(Function),
          },
        },
        draggable: true,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          name: 'Full Name',
          resizable: false,
          func: service.defaultGetter.bind(null),
          comp: service.defaultComparator,
          component: {
            componentConstructor: InfoComponent,
            inputs: {
              name: (e: any) => e.name,
            },
          },
        }),
      ).toEqual(mock2);

      let mock3 = {
        name: 'Full Name',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        sort: null as sortColumn,
        resizable: false,
        component: {
          componentConstructor: InfoComponent,
          inputs: {
            name: expect.any(Function),
          },
        },
        draggable: false,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          name: 'Full Name',
          resizable: false,
          draggable: false,
          func: service.defaultGetter.bind(null),
          comp: service.defaultComparator,
          component: {
            componentConstructor: InfoComponent,
            inputs: {
              name: (e: any) => e.name,
            },
          },
        }),
      ).toEqual(mock3);

      let mock4 = {
        name: 'Full Name',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        resizable: false,
        draggable: false,
        sort: false,
        component: false,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          name: 'Full Name',
          resizable: false,
          draggable: false,
          sort: false,
          func: service.defaultGetter.bind(null),
          comp: service.defaultComparator,
        }),
      ).toEqual(mock4);

      let mock5 = {
        name: 'age2',
        key: 'age2',
        func: expect.any(Function),
        comp: service.defaultComparator,
        resizable: false,
        draggable: false,
        sort: false,
        component: false,
      };
      expect(
        service.createColumnFromConfigColumn({
          key: 'age2',
          resizable: false,
          draggable: false,
          sort: false,
          func: service.defaultGetter.bind(null),
          comp: service.defaultComparator,
        }),
      ).toEqual(mock5);
    });
  });

  describe('setSortOnColumnArray', () => {
    it('should sort null', () => {
      const mock1 = [
        {
          key: 'key',
          sort: null as sortColumn,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock1)).toEqual([
        {
          key: 'key',
          sort: 'asc',
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock2 = [
        {
          key: 'key',
          sort: null as sortColumn,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key3', mock2)).toEqual([
        {
          key: 'key',
          sort: null,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock3 = [
        {
          key: 'key',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock3)).toEqual([
        {
          key: 'key',
          sort: 'asc',
        },
      ]);
    });

    it('should sort asc', () => {
      const mock1 = [
        {
          key: 'key',
          sort: 'asc',
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock1 as any)).toEqual([
        {
          key: 'key',
          sort: 'desc',
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock2 = [
        {
          key: 'key',
          sort: null as sortColumn,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key3', mock2)).toEqual([
        {
          key: 'key',
          sort: null,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock3 = [
        {
          key: 'key',
          sort: 'asc' as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock3)).toEqual([
        {
          key: 'key',
          sort: 'desc',
        },
      ]);
    });

    it('should sort false', () => {
      const mock1 = [
        {
          key: 'key',
          sort: false,
        },
        {
          key: 'key2',
          sort: false,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock1 as any)).toEqual([
        {
          key: 'key',
          sort: false,
        },
        {
          key: 'key2',
          sort: false,
        },
      ]);

      const mock3 = [
        {
          key: 'key',
          sort: false as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock3)).toEqual([
        {
          key: 'key',
          sort: false,
        },
      ]);
    });

    it('should sort desc', () => {
      const mock1 = [
        {
          key: 'key',
          sort: 'desc',
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock1 as any)).toEqual([
        {
          key: 'key',
          sort: null as sortColumn,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock2 = [
        {
          key: 'key',
          sort: null as sortColumn,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key3', mock2)).toEqual([
        {
          key: 'key',
          sort: null,
        },
        {
          key: 'key2',
          sort: null as sortColumn,
        },
      ]);

      const mock3 = [
        {
          key: 'key',
          sort: 'desc' as sortColumn,
        },
      ];

      expect(service.setSortOnColumnArray('key', mock3)).toEqual([
        {
          key: 'key',
          sort: null,
        },
      ]);
    });
  });

  describe('defaultGetter()', () => {
    it('should return item.key', () => {
      const item = {
        key: 'name',
        name: 'title',
      };

      expect(service.defaultGetter(item, item)).toBe('title');
    });
  });

  describe('transformDynamicInput', () => {
    it('should translate input', () => {
      const mock = {};

      const mockItem = {
        name: 'title',
        label: 'label',
      };
      expect(service.transformDynamicInput(null, mockItem)).toEqual({});

      expect(service.transformDynamicInput(mock, mockItem)).toEqual({});

      const mock2 = {
        title: 5,
      };

      expect(service.transformDynamicInput(mock2, mockItem)).toEqual({
        title: 5,
      });

      const mock3 = {
        title: (e: any) => e.label,
      };

      expect(service.transformDynamicInput(mock3, mockItem)).toEqual({
        title: 'label',
      });
    });

    describe('createColumnFromArray', () => {
      it('should return array of column', () => {
        let mock2 = [
          {
            name: 'Full Name',
            key: 'age2',
            func: expect.any(Function),
            comp: service.defaultComparator,
            sort: null as sortColumn,
            resizable: false,
            component: {
              componentConstructor: InfoComponent,
              inputs: {
                name: expect.any(Function),
              },
            },
            draggable: true,
          },
          {
            name: 'name',
            key: 'name',
            func: expect.any(Function),
            comp: service.defaultComparator,
            sort: null as sortColumn,
            resizable: true,
            component: false,
            draggable: true,
          },
        ];
        expect(
          service.createColumnFromArray([
            {
              key: 'age2',
              name: 'Full Name',
              resizable: false,
              func: expect.any(Function),
              comp: service.defaultComparator,
              component: {
                componentConstructor: InfoComponent,
                inputs: {
                  name: (e: any) => e.name,
                },
              },
            },
            'name',
          ]),
        ).toEqual(mock2);
      });
    });
  });
});
