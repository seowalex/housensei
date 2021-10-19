const MARITALSTATUS = 'maritalStatus';
const SINGLENATIONALITY = 'singleNationality';
const SINGLEFIRSTTIMER = 'coupleFirstTimer';
const AGE = 'age';
const WORKINGATLEASTAYEAR = 'workingAtLeastAYear';
const COUPLENATIONALITY = 'singleNationality';
const COUPLEFIRSTTIMER = 'coupleFirstTimer';
const MONTHLYINCOME = 'monthlyIncome';

const HOUSINGTYPE = 'housingType';
const LEASE = 'lease';
const FLATSIZE = 'flatSize';
const LIVINGWITHEXTENDEDFAMILY = 'livingWithExtendedFamily';

const RECEIVEDPROXIMITYBEFORE = 'receivedProximityBefore';
const PROXIMITYSTATUS = 'proximityStatus';

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
                          attribute: 'monthlyIncome',
                          options: {
                            '<=7000': {
                              attribute: 'flatSize',
                              options: {
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                              },
                            },
                            '>7000': 0,
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
                      attribute: 'monthlyIncome',
                      options: {
                        '<=14000': {
                          attribute: 'flatSize',
                          options: {
                            '2 Room': 25000,
                            '3 Room': 25000,
                            '4 Room': 25000,
                            '5 Room': 20000,
                          },
                        },
                        '>14000': 0,
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

const familyGrant = {
  attribute: MARITALSTATUS,
  options: {
    single: 0,
    couple: {
      attribute: HOUSINGTYPE,
      options: {
        BTO: 0,
        Resale: {
          attribute: LEASE,
          options: {
            yes: {
              attribute: COUPLENATIONALITY,
              options: {
                'SC/SC': {
                  attribute: COUPLEFIRSTTIMER,
                  options: {
                    'yes/yes': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=21000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 50000,
                                '3 Room': 50000,
                                '4 Room': 50000,
                                '5 Room': 50000,
                                '3Gen': 40000,
                                Studio: 40000,
                              },
                            },
                            '>21000': 0,
                          },
                        },
                        no: {
                          attribute: 'monthlyIncome, 14000',
                          options: {
                            yes: {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 50000,
                                '3 Room': 50000,
                                '4 Room': 50000,
                                '5 Room': 50000,
                                '3Gen': 40000,
                                Studio: 40000,
                              },
                            },
                            no: 0,
                          },
                        },
                      },
                    },
                    'yes/no': 0,
                    'no/no': 0,
                  },
                },
                'SC/PR': {
                  attribute: COUPLEFIRSTTIMER,
                  options: {
                    'yes/yes': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=21000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 40000,
                                '3 Room': 40000,
                                '4 Room': 40000,
                                '5 Room': 40000,
                                '3Gen': 30000,
                                Studio: 30000,
                              },
                            },
                            '>21000': 0,
                          },
                        },
                        no: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=14000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 40000,
                                '3 Room': 40000,
                                '4 Room': 40000,
                                '5 Room': 40000,
                                '3Gen': 30000,
                                Studio: 30000,
                              },
                            },
                            '>=14000': 0,
                          },
                        },
                      },
                    },
                    'yes/no': 0,
                    'no/no': 0,
                  },
                },
                'SC/F': 0,
              },
            },
            no: 0,
          },
        },
        EC: {
          attribute: COUPLEFIRSTTIMER,
          options: {
            'yes/yes': {
              attribute: COUPLENATIONALITY,
              options: {
                'SC/SC': {
                  attribute: 'monthlyIncome',
                  options: {
                    '<=10000': 30000,
                    '10000 to 11000': 20000,
                    '11000 to 12000': 10000,
                  },
                },
                'SC/PR': {
                  attribute: 'monthlyIncome',
                  options: {
                    '<=10000': 20000,
                    '10000 to 11000': 10000,
                  },
                },
                'SC/F': 0,
              },
            },
            'yes/no': 0,
            'no/no': 0,
          },
        },
      },
    },
  },
};

const halfHousingGrant = {
  attribute: HOUSINGTYPE,
  options: {
    BTO: 0,
    EC: {
      attribute: COUPLEFIRSTTIMER,
      options: {
        'yes/yes': 0,
        'yes/no': {
          attribute: COUPLENATIONALITY,
          options: {
            'SC/SC': {
              attribute: 'monthlyIncome',
              options: {
                '<=10000': 15000,
                '10000 to 11000': 10000,
                '11000 to 12000': 5000,
              },
            },
            'SC/PR': {
              attribute: 'monthlyIncome',
              options: {
                '<=10000': 15000,
                '10000 to 11000': 10000,
                '11000 to 12000': 5000,
              },
            },
            'SC/F': 0,
          },
        },
        'no/no': 0,
      },
    },
    Resale: {
      attribute: LEASE,
      options: {
        yes: {
          attribute: 'maritalStatus',
          options: {
            single: 0,
            couple: {
              attribute: 'coupleNationality',
              options: {
                'SC/SC': {
                  attribute: 'coupleFirstTimer',
                  options: {
                    'yes/yes': 0,
                    'yes/no': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=21000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                                '3Gen': 20000,
                                Studio: 20000,
                              },
                            },
                            '>21000': 0,
                          },
                        },
                        no: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=14000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                                '3Gen': 20000,
                                Studio: 20000,
                              },
                            },
                            '>14000': 0,
                          },
                        },
                      },
                    },
                    'no/no': 0,
                  },
                },
                'SC/PR': {
                  attribute: 'coupleFirstTimer',
                  options: {
                    'yes/yes': 0,
                    'yes/no': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=21000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                                '3Gen': 20000,
                                Studio: 20000,
                              },
                            },
                            '>21000': 0,
                          },
                        },
                        no: {
                          attribute: 'monthlyIncome',
                          options: {
                            '<=14000': {
                              attribute: FLATSIZE,
                              options: {
                                '1 Room': 0,
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                                '3Gen': 20000,
                                Studio: 20000,
                              },
                            },
                            '>14000': 0,
                          },
                        },
                      },
                    },
                    'no/no': 0,
                  },
                },
                'SC/F': 0,
              },
            },
          },
        },
        no: 0,
      },
    },
  },
};

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
