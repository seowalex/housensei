const singleEHG = {
  attribute: 'maritalStatus',
  options: {
    single: {
      attribute: 'singleNationality',
      options: {
        citizen: {
          attribute: 'singleFirstTimer',
          options: {
            yes: {
              attribute: 'age',
              options: {
                'Above 35': {
                  attribute: 'workingAtLeastAYear',
                  options: {
                    yes: {
                      attribute: 'housingType',
                      options: {
                        BTO: true,
                        Resale: {
                          attribute: 'lease',
                          options: {
                            'More than 20 years': true,
                            'Less than 20 years': false,
                          },
                        },
                        EC: false,
                      },
                    },
                    no: false,
                  },
                },
                'Below 35': false,
              },
            },
            no: false,
          },
        },
        'non-Citizen': false,
      },
    },
    couple: {
      attribute: 'coupleNationality',
      options: {
        'SC/SC': {
          attribute: 'coupleFirstTimer',
          options: {
            'FT/FT': false,
            'FT/ST': {
              attribute: 'workingAtLeastAYear',
              options: {
                yes: {
                  attribute: 'housingType',
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: 'lease',
                      options: {
                        'More than 20 years': true,
                        'Less than 20 years': false,
                      },
                    },
                    EC: true,
                  },
                },
                no: false,
              },
            },
          },
        },
        'SC/PR': {
          attribute: 'coupleFirstTimer',
          options: {
            'FT/FT': false,
            'FT/ST': {
              attribute: 'workingAtLeastAYear',
              options: {
                yes: {
                  attribute: 'housingType',
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: 'lease',
                      options: {
                        'More than 20 years': true,
                        'Less than 20 years': false,
                      },
                    },
                    EC: true,
                  },
                },
                no: false,
              },
            },
          },
        },
        'SC/F': {
          attribute: 'singleFirstTimer',
          options: {
            no: false,
            yes: {
              attribute: 'workingAtLeastAYear',
              options: {
                yes: {
                  attribute: 'housingType',
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: 'lease',
                      options: {
                        'More than 20 years': true,
                        'Less than 20 years': false,
                      },
                    },
                    EC: true,
                  },
                },
                no: false,
              },
            },
          },
        },
      },
    },
  },
};

const ehg = {
  attribute: 'maritalStatus',
  options: {
    single: false,
    couple: {
      attribute: 'coupleNationality',
      options: {
        'SC/SC': {
          attribute: 'coupleFirstTimer',
          options: {
            'FT/FT': {
              attribute: 'workingAtLeastAYear',
              options: {
                yes: true,
                no: false,
              },
            },
            'FT/ST': false,
          },
        },
        'SC/PR': {
          attribute: 'coupleFirstTimer',
          options: {
            'FT/FT': {
              attribute: 'workingAtLeastAYear',
              options: {
                yes: true,
                no: false,
              },
            },
            'FT/ST': false,
          },
        },
        'SC/F': false,
      },
    },
  },
};

const singleGrant = {
  attribute: 'maritalStatus',
  options: {
    single: {
      attribute: 'singleNationality',
      options: {
        SC: {
          attribute: 'singleFirstTimer',
          options: {
            yes: {
              attribute: 'age',
              options: {
                'Above 35': {
                  attribute: 'housingType',
                  options: {
                    BTO: 0,
                    Resale: {
                      attribute: 'lease',
                      options: {
                        'More than 20 years': {
                          attribute: 'monthlyIncome,7000',
                          options: {
                            yes: {
                              attribute: 'flatSize',
                              options: {
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                              },
                            },
                            no: 0,
                          },
                        },
                        'Less than 20 years': 0,
                      },
                    },
                    EC: 0,
                  },
                },
                'Below 35': 0,
              },
            },
            no: 0,
          },
        },
        PR: 0,
        F: 0,
      },
    },
    couple: {
      attribute: 'coupleNationality',
      options: {
        'SC/SC': 0,
        'SC/PR': 0,
        'SC/F': {
          attribute: 'singleFirstTimer',
          options: {
            yes: {
              attribute: 'housingType',
              options: {
                BTO: 0,
                Resale: {
                  attribute: 'lease',
                  options: {
                    'More than 20 years': {
                      attribute: 'monthlyIncome,14000',
                      options: {
                        yes: {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 25000,
                            '3 Room': 25000,
                            '4 Room': 25000,
                            '5 Room': 20000,
                          },
                        },
                        no: 0,
                      },
                    },
                    'Less than 20 years': 0,
                  },
                },
                EC: 0,
              },
            },
            no: 0,
          },
        },
      },
    },
  },
};

const familyGrant = {};

const halfHousingGrant = {};

const proximityGrant = {
  attribute: 'receivedProximityBefore',
  options: {
    yes: 0,
    no: {
      attribute: 'housingType',
      options: {
        BTO: 0,
        Resale: {
          attribute: 'lease',
          options: {
            'More than 20 years': {
              attribute: 'maritalStatus',
              options: {
                single: {
                  attribute: 'singleNationality',
                  options: {
                    SC: {
                      attribute: 'proximityStatus',
                      options: {
                        'Within 4km': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 10000,
                            '3 Room': 10000,
                            '4 Room': 10000,
                            '5 Room': 10000,
                          },
                        },
                        'Live together': 15000,
                        No: 0,
                      },
                    },
                    PR: 0,
                    F: 0,
                  },
                },
                couple: {
                  attribute: 'coupleNationality',
                  options: {
                    'SC/SC': {
                      attribute: 'proximityStatus',
                      options: {
                        'Within 4km': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 20000,
                            '3 Room': 20000,
                            '4 Room': 20000,
                            '5 Room': 20000,
                          },
                        },
                        'Live together': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 30000,
                            '3 Room': 30000,
                            '4 Room': 30000,
                            '5 Room': 30000,
                          },
                        },
                        No: 0,
                      },
                    },
                    'SC/PR': {
                      attribute: 'proximityStatus',
                      options: {
                        'Within 4km': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 20000,
                            '3 Room': 20000,
                            '4 Room': 20000,
                            '5 Room': 20000,
                          },
                        },
                        'Live together': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 30000,
                            '3 Room': 30000,
                            '4 Room': 30000,
                            '5 Room': 30000,
                          },
                        },
                        No: 0,
                      },
                    },
                    'SC/F': 0,
                  },
                },
              },
            },
            'Less than 20 years': 0,
          },
        },
        EC: 0,
      },
    },
  },
};

export default {
  singleEHG,
  ehg,
  singleGrant,
  familyGrant,
  halfHousingGrant,
  proximityGrant,
};
