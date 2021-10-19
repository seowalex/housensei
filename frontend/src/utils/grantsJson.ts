const MARITALSTATUS = 'maritalStatus';
const SINGLENATIONALITY = 'singleNationality';
const SINGLEFIRSTTIMER = 'singleFirstTimer';
const AGE = 'age';
const WORKINGATLEASTAYEAR = 'workingAtLeastAYear';
const COUPLENATIONALITY = 'coupleNationality';
const COUPLEFIRSTTIMER = 'coupleFirstTimer';
const MONTHLYINCOME = 'monthlyIncome';

const HOUSINGTYPE = 'housingType';
const LEASE = 'lease';
const FLATSIZE = 'flatSize';
const LIVINGWITHEXTENDEDFAMILY = 'livingWithExtendedFamily';

const RECEIVEDPROXIMITYBEFORE = 'receivedProximityBefore';
const PROXIMITYSTATUS = 'proximityStatus';

const singleEHG = {
  attribute: MARITALSTATUS,
  options: {
    single: {
      attribute: SINGLENATIONALITY,
      options: {
        SC: {
          attribute: SINGLEFIRSTTIMER,
          options: {
            yes: {
              attribute: AGE,
              options: {
                yes: {
                  attribute: WORKINGATLEASTAYEAR,
                  options: {
                    yes: {
                      attribute: HOUSINGTYPE,
                      options: {
                        BTO: true,
                        Resale: {
                          attribute: LEASE,
                          options: {
                            yes: true,
                            no: false,
                          },
                        },
                        EC: false,
                      },
                    },
                    no: false,
                  },
                },
                no: false,
              },
            },
            no: false,
          },
        },
        PR: false,
        F: false,
      },
    },
    couple: {
      attribute: COUPLENATIONALITY,
      options: {
        'SC/SC': {
          attribute: COUPLEFIRSTTIMER,
          options: {
            'yes/yes': false,
            'yes/no': {
              attribute: WORKINGATLEASTAYEAR,
              options: {
                yes: {
                  attribute: HOUSINGTYPE,
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: LEASE,
                      options: {
                        yes: true,
                        no: false,
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
          attribute: COUPLEFIRSTTIMER,
          options: {
            'yes/yes': false,
            'yes/no': {
              attribute: WORKINGATLEASTAYEAR,
              options: {
                yes: {
                  attribute: HOUSINGTYPE,
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: LEASE,
                      options: {
                        yes: true,
                        no: false,
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
          attribute: SINGLEFIRSTTIMER,
          options: {
            no: false,
            yes: {
              attribute: WORKINGATLEASTAYEAR,
              options: {
                yes: {
                  attribute: HOUSINGTYPE,
                  options: {
                    BTO: true,
                    Resale: {
                      attribute: LEASE,
                      options: {
                        yes: true,
                        no: false,
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
  attribute: MARITALSTATUS,
  options: {
    single: false,
    couple: {
      attribute: COUPLENATIONALITY,
      options: {
        'SC/SC': {
          attribute: COUPLEFIRSTTIMER,
          options: {
            'yes/yes': {
              attribute: WORKINGATLEASTAYEAR,
              options: {
                yes: true,
                no: false,
              },
            },
            'yes/no': false,
          },
        },
        'SC/PR': {
          attribute: COUPLEFIRSTTIMER,
          options: {
            'yes/yes': {
              attribute: WORKINGATLEASTAYEAR,
              options: {
                yes: true,
                no: false,
              },
            },
            'yes/no': false,
          },
        },
        'SC/F': false,
      },
    },
  },
};

const singleGrant = {
  attribute: MARITALSTATUS,
  options: {
    single: {
      attribute: SINGLENATIONALITY,
      options: {
        SC: {
          attribute: SINGLEFIRSTTIMER,
          options: {
            yes: {
              attribute: AGE,
              options: {
                yes: {
                  attribute: HOUSINGTYPE,
                  options: {
                    BTO: 0,
                    Resale: {
                      attribute: LEASE,
                      options: {
                        yes: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 7000': {
                              attribute: FLATSIZE,
                              options: {
                                '2 Room': 25000,
                                '3 Room': 25000,
                                '4 Room': 25000,
                                '5 Room': 20000,
                              },
                            },
                            '> 7000': 0,
                          },
                        },
                        no: 0,
                      },
                    },
                    EC: 0,
                  },
                },
                no: 0,
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
      attribute: COUPLENATIONALITY,
      options: {
        'SC/SC': 0,
        'SC/PR': 0,
        'SC/F': {
          attribute: SINGLEFIRSTTIMER,
          options: {
            yes: {
              attribute: HOUSINGTYPE,
              options: {
                BTO: 0,
                Resale: {
                  attribute: LEASE,
                  options: {
                    yes: {
                      attribute: MONTHLYINCOME,
                      options: {
                        '<= 14000': {
                          attribute: FLATSIZE,
                          options: {
                            '2 Room': 25000,
                            '3 Room': 25000,
                            '4 Room': 25000,
                            '5 Room': 20000,
                          },
                        },
                        '> 14000': 0,
                      },
                    },
                    no: 0,
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
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 21000': {
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
                            '> 21000': 0,
                          },
                        },
                        no: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 14000': {
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
                            '> 14000': 0,
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
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 21000': {
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
                            '> 21000': 0,
                          },
                        },
                        no: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 14000': {
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
                            '>= 14000': 0,
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
                  attribute: MONTHLYINCOME,
                  options: {
                    '<= 10000': 30000,
                    '> 10000 && <= 11000': 20000,
                    '> 11000 && <= 12000': 10000,
                  },
                },
                'SC/PR': {
                  attribute: MONTHLYINCOME,
                  options: {
                    '<= 10000': 20000,
                    '> 10000 && <= 11000': 10000,
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
              attribute: MONTHLYINCOME,
              options: {
                '<= 10000': 15000,
                '> 10000 && <= 11000': 10000,
                '> 11000 && <= 12000': 5000,
              },
            },
            'SC/PR': {
              attribute: MONTHLYINCOME,
              options: {
                '<= 10000': 15000,
                '> 10000 && <= 11000': 10000,
                '> 11000 && <= 12000': 5000,
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
          attribute: MARITALSTATUS,
          options: {
            single: 0,
            couple: {
              attribute: COUPLENATIONALITY,
              options: {
                'SC/SC': {
                  attribute: COUPLEFIRSTTIMER,
                  options: {
                    'yes/yes': 0,
                    'yes/no': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 21000': {
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
                            '> 21000': 0,
                          },
                        },
                        no: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 14000': {
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
                            '> 14000': 0,
                          },
                        },
                      },
                    },
                    'no/no': 0,
                  },
                },
                'SC/PR': {
                  attribute: COUPLEFIRSTTIMER,
                  options: {
                    'yes/yes': 0,
                    'yes/no': {
                      attribute: LIVINGWITHEXTENDEDFAMILY,
                      options: {
                        yes: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 21000': {
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
                            '> 21000': 0,
                          },
                        },
                        no: {
                          attribute: MONTHLYINCOME,
                          options: {
                            '<= 14000': {
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
                            '> 14000': 0,
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
  attribute: RECEIVEDPROXIMITYBEFORE,
  options: {
    yes: 0,
    no: {
      attribute: HOUSINGTYPE,
      options: {
        BTO: 0,
        Resale: {
          attribute: LEASE,
          options: {
            yes: {
              attribute: MARITALSTATUS,
              options: {
                single: {
                  attribute: SINGLENATIONALITY,
                  options: {
                    SC: {
                      attribute: PROXIMITYSTATUS,
                      options: {
                        'Within 4km': {
                          attribute: FLATSIZE,
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
                  attribute: COUPLENATIONALITY,
                  options: {
                    'SC/SC': {
                      attribute: PROXIMITYSTATUS,
                      options: {
                        'Within 4km': {
                          attribute: FLATSIZE,
                          options: {
                            '2 Room': 20000,
                            '3 Room': 20000,
                            '4 Room': 20000,
                            '5 Room': 20000,
                          },
                        },
                        'Live together': {
                          attribute: FLATSIZE,
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
                      attribute: PROXIMITYSTATUS,
                      options: {
                        'Within 4km': {
                          attribute: FLATSIZE,
                          options: {
                            '2 Room': 20000,
                            '3 Room': 20000,
                            '4 Room': 20000,
                            '5 Room': 20000,
                          },
                        },
                        'Live together': {
                          attribute: FLATSIZE,
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
            no: 0,
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
