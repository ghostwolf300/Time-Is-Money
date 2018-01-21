package com.tim.db.usercontract;

import com.tim.db.common.DateEffectiveRepository;
import com.tim.entities.UserContract;

public interface UserContractRepositoryCustom extends DateEffectiveRepository<UserContract> {
	public UserContract save(UserContract userContract);
}
