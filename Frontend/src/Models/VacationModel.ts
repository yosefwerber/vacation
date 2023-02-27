import { RegisterOptions } from "react-hook-form";



class VacationModel {
    public vacationId: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageFile: string;
    public image: File;
    public isFollowing: number;
    public followers: number;
    public followersCount: number;




    public static destinationValidation: RegisterOptions = {
        required: { value: true, message: "Missing destination"},
        minLength: { value: 2, message: "destination must be minimum 2 chars"},
        maxLength: { value: 100, message: "destination can't exceeds 100 chars"}
    };

    public static descriptionValidation: RegisterOptions = {
        required: { value: true, message: "Missing description"},
        minLength: { value: 10, message: "description must be minimum 50 chars"},
        maxLength: { value: 1000, message: "description can't exceeds 1000 chars"}
    };

    public static startDateValidation: RegisterOptions = {
        required: { value: true, message: 'Missing start date' },
        validate: (value: string) => {
          const isValidDate = /\d{4}-\d{2}-\d{2}/.test(value);
          if (!isValidDate) {
            return 'Invalid date format';
          }
          return true;
        },
      };

      public static endDateValidation: RegisterOptions = {
        required: { value: true, message: 'Missing end date' },
        validate: (value: string) => {
          const isValidDate = /\d{4}-\d{2}-\d{2}/.test(value);
          if (!isValidDate) {
            return 'Invalid date format';
          }
        //   const startDate = new Date(values.startDate);
        //   const endDate = new Date(value);
        //   if (endDate < startDate) {
        //     return 'End date must be after start date';
        //   }
          return true;
        },
      };

      public static priceValidation: RegisterOptions = {
        required: { value: true, message: 'Missing price' },
        min: { value: 0, message: "Price can't be negative" },
        max: { value: 10000, message: "Price can't exceed 10000" },
      };

      public static imageValidation: RegisterOptions = {
        required: { value: true, message: 'Missing image' },
      };
    }




export default VacationModel;
